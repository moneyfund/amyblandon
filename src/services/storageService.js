import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseEnabled, storage } from '../firebase/firebase';

export const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

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

function uploadImage(path, file, onProgress) {
  validateImage(file);
  if (!firebaseEnabled) {
    return Promise.resolve({
      url: URL.createObjectURL(file),
      path: '',
      name: file.name,
      size: file.size,
      type: file.type,
    });
  }

  const task = uploadBytesResumable(ref(storage, path), file, { contentType: file.type });
  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      reject,
      async () => {
        resolve({
          url: await getDownloadURL(task.snapshot.ref),
          path,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      },
    );
  });
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
