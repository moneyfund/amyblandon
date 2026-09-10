import { getMetadata, ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseEnabled, storage } from '../firebase/firebase';

const VERSION = 'adaptive-natural-v1';
const MAX_DIMENSION = 3840;
const SAMPLE_SIZE = 160;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function canonicalPropertyImageUrl(value = '') {
  try {
    const url = new URL(value, window.location.origin);
    url.searchParams.delete('amyv');
    return url.toString();
  } catch {
    return String(value || '');
  }
}

function storagePathFromUrl(value = '') {
  try {
    const url = new URL(canonicalPropertyImageUrl(value));
    const marker = '/o/';
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex >= 0) return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
    if (url.hostname === 'storage.googleapis.com') {
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length > 1) return decodeURIComponent(parts.slice(1).join('/'));
    }
  } catch {
    return '';
  }
  return '';
}

function loadImage(blob) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => resolve({ image, objectUrl });
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo procesar una de las fotografías.'));
    };
    image.src = objectUrl;
  });
}

function analyze(image) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const scale = Math.min(1, SAMPLE_SIZE / Math.max(sourceWidth, sourceHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(sourceWidth * scale));
  canvas.height = Math.max(1, Math.round(sourceHeight * scale));
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return { luminance: 128, deviation: 50, chroma: 45 };
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let count = 0;
  let sum = 0;
  let squared = 0;
  let chroma = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] < 24) continue;
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const lum = (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
    count += 1;
    sum += lum;
    squared += lum * lum;
    chroma += Math.max(red, green, blue) - Math.min(red, green, blue);
  }
  if (!count) return { luminance: 128, deviation: 50, chroma: 45 };
  const luminance = sum / count;
  return {
    luminance,
    deviation: Math.sqrt(Math.max(0, (squared / count) - (luminance * luminance))),
    chroma: chroma / count,
  };
}

function factors(stats) {
  return {
    brightness: clamp(1 + ((132 - stats.luminance) / 1000), 0.99, 1.055),
    contrast: clamp(1 + ((52 - stats.deviation) / 650), 1, 1.06),
    saturation: clamp(1 + ((48 - stats.chroma) / 1000), 1, 1.045),
  };
}

function toBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('No se pudo generar la imagen mejorada.')), type, quality);
  });
}

async function renderEnhanced(sourceBlob) {
  const { image, objectUrl } = await loadImage(sourceBlob);
  try {
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    const scale = Math.min(1, MAX_DIMENSION / Math.max(sourceWidth, sourceHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(sourceWidth * scale));
    canvas.height = Math.max(1, Math.round(sourceHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('El navegador no pudo preparar la mejora de imagen.');
    const adjustment = factors(analyze(image));
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.filter = `brightness(${adjustment.brightness.toFixed(3)}) contrast(${adjustment.contrast.toFixed(3)}) saturate(${adjustment.saturation.toFixed(3)})`;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    context.filter = 'none';
    const sourceType = String(sourceBlob.type || '').toLowerCase();
    const outputType = ['image/jpeg', 'image/png', 'image/webp'].includes(sourceType) ? sourceType : 'image/jpeg';
    return toBlob(canvas, outputType, outputType === 'image/png' ? undefined : 0.94);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function uploadReplacement(storageRef, blob, metadata) {
  const task = uploadBytesResumable(storageRef, blob, metadata);
  return new Promise((resolve, reject) => task.on('state_changed', undefined, reject, () => resolve(task.snapshot)));
}

export async function enhanceStoredPropertyImage(sourceUrl) {
  if (!firebaseEnabled) throw new Error('La mejora automática necesita Firebase Storage activo.');
  const canonicalUrl = canonicalPropertyImageUrl(sourceUrl);
  const storagePath = storagePathFromUrl(canonicalUrl);
  if (!storagePath) throw new Error('No se pudo identificar una fotografía en Storage.');
  const storageRef = ref(storage, storagePath);
  const metadata = await getMetadata(storageRef);
  if (metadata.customMetadata?.amyAutoEnhanced === VERSION) return { skipped: true };

  const response = await fetch(`/api/property-image?url=${encodeURIComponent(canonicalUrl)}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`No se pudo leer una fotografía (${response.status}).`);
  const sourceBlob = await response.blob();
  if (!sourceBlob.type.startsWith('image/')) throw new Error('Uno de los archivos no es una imagen válida.');
  const enhancedBlob = await renderEnhanced(sourceBlob);
  const parsedUrl = new URL(canonicalUrl);
  const token = parsedUrl.searchParams.get('token');
  const customMetadata = {
    ...(metadata.customMetadata || {}),
    amyAutoEnhanced: VERSION,
    amyEnhancementProfile: 'natural-brightness-contrast-saturation',
  };
  if (token) customMetadata.firebaseStorageDownloadTokens = token;

  await uploadReplacement(storageRef, enhancedBlob, {
    contentType: enhancedBlob.type || metadata.contentType || 'image/jpeg',
    cacheControl: metadata.cacheControl || 'public,max-age=3600',
    customMetadata,
  });
  return { skipped: false };
}
