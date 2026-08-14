import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseEnabled, storage } from '../firebase/firebase';

export const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

const UPLOAD_STALL_TIMEOUT_MS = 25000;
const UPLOAD_TOTAL_TIMEOUT_MS = 90000;
const DOWNLOAD_URL_TIMEOUT_MS = 15000;
const MAX_UPLOAD_ATTEMPTS = 2;

export function validateImage(file) {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error('Solo se permiten imágenes JPG, JPEG, PNG o WEBP.');
  if (file.size > MAX_IMAGE_SIZE) throw new Error('Cada imagen debe pesar máximo 8 MB.');
}

function safeFileName(name = 'imagen') {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function withTimeout(promise, timeoutMs, message) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(message)), timeoutMs);
    promise.then((value) => {
      window.clearTimeout(timer);
      resolve(value);
    }).catch((error) => {
      window.clearTimeout(timer);
      reject(error);
    });
  });
}

function uploadImageOnce(path, file, onProgress) {
  const task = uploadBytesResumable(ref(storage, path), file, { contentType: file.type });

  return new Promise((resolve, reject) => {
    let settled = false;
    let lastTransferred = -1;
    let stallTimer = null;
    let totalTimer = null;
    let unsubscribe = () => {};

    const cleanup = () => {
      if (stallTimer) window.clearTimeout(stallTimer);
      if (totalTimer) window.clearTimeout(totalTimer);
      unsubscribe();
    };

    const rejectOnce = (error, cancelTask = false) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (cancelTask) {
        try { task.cancel(); } catch { /* La tarea ya pudo haber terminado. */ }
      }
      reject(error);
    };

    const armStallTimer = () => {
      if (stallTimer) window.clearTimeout(stallTimer);
      stallTimer = window.setTimeout(() => {
        const error = new Error('La carga de una fotografía se detuvo por conexión inestable.');
        error.code = 'upload/stalled';
        rejectOnce(error, true);
      }, UPLOAD_STALL_TIMEOUT_MS);
    };

    totalTimer = window.setTimeout(() => {
      const error = new Error('Una fotografía tardó demasiado en subir y la carga fue cancelada para evitar que el formulario se bloquee.');
      error.code = 'upload/timeout';
      rejectOnce(error, true);
    }, UPLOAD_TOTAL_TIMEOUT_MS);

    armStallTimer();

    unsubscribe = task.on(
      'state_changed',
      (snapshot) => {
        if (settled) return;
        if (snapshot.bytesTransferred !== lastTransferred) {
          lastTransferred = snapshot.bytesTransferred;
          armStallTimer();
        }
        const progress = snapshot.totalBytes
          ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          : 0;
        onProgress?.(progress);
      },
      (error) => rejectOnce(error),
      async () => {
        if (settled) return;
        if (stallTimer) window.clearTimeout(stallTimer);
        if (totalTimer) window.clearTimeout(totalTimer);
        unsubscribe();
        try {
          const url = await withTimeout(
            getDownloadURL(task.snapshot.ref),
            DOWNLOAD_URL_TIMEOUT_MS,
            'La fotografía terminó de subir, pero no se pudo obtener su enlace a tiempo.',
          );
          if (settled) return;
          settled = true;
          resolve({
            url,
            path,
            name: file.name,
            size: file.size,
            type: file.type,
          });
        } catch (error) {
          rejectOnce(error);
        }
      },
    );
  });
}

function shouldRetryUpload(error) {
  const code = String(error?.code || '');
  const nonRetryable = new Set([
    'storage/unauthorized',
    'storage/unauthenticated',
    'storage/quota-exceeded',
    'storage/invalid-argument',
    'storage/invalid-format',
  ]);
  return !nonRetryable.has(code);
}

async function uploadImage(path, file, onProgress) {
  validateImage(file);
  if (!firebaseEnabled) {
    return {
      url: URL.createObjectURL(file),
      path: '',
      name: file.name,
      size: file.size,
      type: file.type,
    };
  }

  let lastError = null;
  for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt += 1) {
    try {
      if (attempt > 1) onProgress?.(0);
      return await uploadImageOnce(path, file, onProgress);
    } catch (error) {
      lastError = error;
      if (attempt >= MAX_UPLOAD_ATTEMPTS || !shouldRetryUpload(error)) break;
      await new Promise((resolve) => window.setTimeout(resolve, 800));
    }
  }

  if (lastError?.code === 'upload/stalled' || lastError?.code === 'upload/timeout') {
    throw new Error('La conexión se interrumpió mientras se subía una fotografía. Las demás cargas no quedarán bloqueadas; vuelve a seleccionar únicamente la imagen que faltó.');
  }
  throw lastError || new Error('No se pudo subir la fotografía.');
}

export function uploadPropertyImage(propertyId, file, onProgress) {
  const path = `properties/${propertyId}/images/${Date.now()}-${safeFileName(file.name)}`;
  return uploadImage(path, file, onProgress);
}

export function uploadSiteImage(slotKey, file, onProgress) {
  const path = `site-content/${slotKey}-${Date.now()}-${safeFileName(file.name)}`;
  return uploadImage(path, file, onProgress);
}

export async function deleteStorageFile(path) {
  if (!firebaseEnabled || !path) return true;
  return deleteObject(ref(storage, path));
}
