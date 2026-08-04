import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseEnabled, storage } from '../firebase/firebase';

export const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

export function validateImage(file) {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error('Solo se permiten imágenes JPG, JPEG, PNG o WEBP.');
  if (file.size > MAX_IMAGE_SIZE) throw new Error('Cada imagen debe pesar máximo 8 MB.');
}

export function uploadPropertyImage(propertyId, file, onProgress) {
  validateImage(file);
  if (!firebaseEnabled) return Promise.resolve({ url: URL.createObjectURL(file), path: '', name: file.name, size: file.size, type: file.type });
  const path = `properties/${propertyId}/images/${Date.now()}-${file.name}`;
  const task = uploadBytesResumable(ref(storage, path), file, { contentType: file.type });
  return new Promise((resolve, reject) => {
    task.on('state_changed', (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)), reject, async () => {
      resolve({ url: await getDownloadURL(task.snapshot.ref), path, name: file.name, size: file.size, type: file.type });
    });
  });
}

export async function deleteStorageFile(path) {
  if (!firebaseEnabled || !path) return true;
  return deleteObject(ref(storage, path));
}
