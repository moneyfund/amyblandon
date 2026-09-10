import {
  getDownloadURL,
  getMetadata,
  ref,
  updateMetadata,
  uploadBytes,
} from 'firebase/storage';
import { firebaseEnabled, storage } from '../firebase/firebase';

const VERSION = 'adaptive-natural-v3';
const MAX_DIMENSION = 4096;
const SAMPLE_SIZE = 180;
const MAX_OUTPUT_SIZE = 8 * 1024 * 1024;
const replacements = new Map();
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

export function resolveEnhancedImageUrl(value = '') {
  const canonical = canonicalPropertyImageUrl(value);
  return replacements.get(canonical) || canonical;
}

function registerReplacement(sourceUrl, enhancedUrl) {
  const source = canonicalPropertyImageUrl(sourceUrl);
  const enhanced = canonicalPropertyImageUrl(enhancedUrl);
  if (source && enhanced) replacements.set(source, enhanced);
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

function enhancedPathFromOriginal(storagePath) {
  const slashIndex = storagePath.lastIndexOf('/');
  const directory = slashIndex >= 0 ? storagePath.slice(0, slashIndex + 1) : '';
  const fileName = slashIndex >= 0 ? storagePath.slice(slashIndex + 1) : storagePath;
  const extensionIndex = fileName.lastIndexOf('.');
  const rawBaseName = extensionIndex > 0 ? fileName.slice(0, extensionIndex) : fileName;
  const baseName = rawBaseName.replace(/-auto-enhanced-v\d+$/i, '');
  return `${directory}${baseName}-auto-enhanced-v3.webp`;
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
    const luminance = (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
    count += 1;
    sum += luminance;
    squared += luminance * luminance;
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
  const darknessNeed = clamp((140 - stats.luminance) / 90, -0.4, 0.9);
  const contrastNeed = clamp((56 - stats.deviation) / 48, -0.45, 1);
  const colorNeed = clamp((52 - stats.chroma) / 58, -0.4, 0.9);

  return {
    brightness: clamp(1.04 + (darknessNeed * 0.065), 1.015, 1.10),
    contrast: clamp(1.075 + (contrastNeed * 0.055), 1.055, 1.135),
    saturation: clamp(1.055 + (colorNeed * 0.05), 1.04, 1.10),
  };
}

function toBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('No se pudo generar la imagen mejorada.')),
      type,
      quality,
    );
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
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.filter = `brightness(${adjustment.brightness.toFixed(3)}) contrast(${adjustment.contrast.toFixed(3)}) saturate(${adjustment.saturation.toFixed(3)})`;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    context.filter = 'none';

    for (const quality of [0.95, 0.92, 0.88, 0.84, 0.8]) {
      const blob = await toBlob(canvas, 'image/webp', quality);
      if (blob.size <= MAX_OUTPUT_SIZE || quality === 0.8) return blob;
    }

    throw new Error('La fotografía mejorada supera el tamaño máximo permitido.');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function existingEnhancedTarget(metadata) {
  if (metadata.customMetadata?.amyAutoEnhancedVersion !== VERSION) return '';
  const targetPath = metadata.customMetadata?.amyAutoEnhancedPath;
  if (!targetPath) return '';
  try {
    return await getDownloadURL(ref(storage, targetPath));
  } catch {
    return '';
  }
}

export async function enhanceStoredPropertyImage(sourceUrl) {
  if (!firebaseEnabled) throw new Error('La mejora automática necesita Firebase Storage activo.');

  const canonicalUrl = canonicalPropertyImageUrl(sourceUrl);
  const mappedUrl = replacements.get(canonicalUrl);
  if (mappedUrl) return { skipped: true, url: mappedUrl };

  const currentPath = storagePathFromUrl(canonicalUrl);
  if (!currentPath) throw new Error('No se pudo identificar una fotografía en Storage.');

  const currentRef = ref(storage, currentPath);
  const currentMetadata = await getMetadata(currentRef);

  if (currentMetadata.customMetadata?.amyAutoEnhanced === VERSION) {
    registerReplacement(canonicalUrl, canonicalUrl);
    return { skipped: true, url: canonicalUrl };
  }

  const sourcePath = currentMetadata.customMetadata?.amyAutoEnhancedSourcePath || currentPath;
  const sourceRef = ref(storage, sourcePath);
  const sourceMetadata = sourcePath === currentPath ? currentMetadata : await getMetadata(sourceRef);

  const rememberedTarget = await existingEnhancedTarget(sourceMetadata);
  if (rememberedTarget) {
    registerReplacement(canonicalUrl, rememberedTarget);
    return { skipped: true, url: rememberedTarget };
  }

  const sourceDownloadUrl = sourcePath === currentPath ? canonicalUrl : await getDownloadURL(sourceRef);
  const response = await fetch(`/api/property-image?url=${encodeURIComponent(sourceDownloadUrl)}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`No se pudo leer una fotografía (${response.status}).`);

  const sourceBlob = await response.blob();
  if (!sourceBlob.type.startsWith('image/')) throw new Error('Uno de los archivos no es una imagen válida.');

  const enhancedBlob = await renderEnhanced(sourceBlob);
  if (enhancedBlob.size > MAX_OUTPUT_SIZE) {
    throw new Error('La versión mejorada quedó demasiado pesada para Firebase Storage.');
  }

  const targetPath = enhancedPathFromOriginal(sourcePath);
  const targetRef = ref(storage, targetPath);

  await uploadBytes(targetRef, enhancedBlob, {
    contentType: 'image/webp',
    cacheControl: 'public,max-age=3600',
    customMetadata: {
      amyAutoEnhanced: VERSION,
      amyEnhancementProfile: 'real-estate-natural-visible-v3',
      amyAutoEnhancedSourcePath: sourcePath,
    },
  });

  const enhancedUrl = await getDownloadURL(targetRef);
  registerReplacement(canonicalUrl, enhancedUrl);

  try {
    await updateMetadata(sourceRef, {
      customMetadata: {
        ...(sourceMetadata.customMetadata || {}),
        amyAutoEnhancedPath: targetPath,
        amyAutoEnhancedVersion: VERSION,
      },
    });
  } catch (metadataError) {
    console.warn('[Amy] No se pudo guardar la referencia de mejora en los metadatos originales.', metadataError);
  }

  return { skipped: false, url: enhancedUrl, path: targetPath };
}
