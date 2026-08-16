import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase/firebase';
import { demoProperties } from '../data/demoData';
import { deleteStorageFile } from './storageService';

const collectionName = 'properties';

const asList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return value ? [value] : [];
};

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);

const storagePathFromDownloadUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const parsed = new URL(value);
    const allowedHost = parsed.hostname === 'firebasestorage.googleapis.com'
      || parsed.hostname === 'storage.googleapis.com';
    if (!allowedHost) return '';

    const marker = '/o/';
    const markerIndex = parsed.pathname.indexOf(marker);
    if (markerIndex < 0) return '';

    const encodedPath = parsed.pathname.slice(markerIndex + marker.length);
    return decodeURIComponent(encodedPath);
  } catch {
    return '';
  }
};

const normalizeImage = (image) => {
  if (!image) return null;
  if (typeof image === 'string') {
    return {
      url: image,
      path: storagePathFromDownloadUrl(image),
      name: '',
      size: 0,
      type: '',
    };
  }

  if (typeof image === 'object') {
    const url = image.url || image.src || '';
    if (!url) return null;
    return {
      ...image,
      url,
      path: image.path || storagePathFromDownloadUrl(url),
    };
  }

  return null;
};

const asImages = (value) => {
  const source = Array.isArray(value) ? value : value ? [value] : [];
  return source.map(normalizeImage).filter(Boolean);
};

const normalize = (data = {}) => {
  const hasStructuredAmenities = hasOwn(data, 'features') || hasOwn(data, 'services');

  return {
    ...data,
    images: asImages(data.images),
    features: asList(data.features),
    services: asList(data.services),
    amenities: asList(data.amenities),
    highlightTags: asList(data.highlightTags),
    propertyDetails: data.propertyDetails && typeof data.propertyDetails === 'object'
      ? data.propertyDetails
      : {},
    publicationStatus: data.publicationStatus || (data.published ? 'published' : 'draft'),
    status: data.status || 'available',
    _hasStructuredAmenities: hasStructuredAmenities,
  };
};

const timestampValue = (value) => {
  if (value?.toMillis) return value.toMillis();
  if (value instanceof Date) return value.getTime();
  return Number(value) || 0;
};

const sortProperties = (properties, admin = false) => {
  if (admin) {
    return [...properties].sort((a, b) => timestampValue(b.updatedAt) - timestampValue(a.updatedAt));
  }

  return [...properties].sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));
};

const propertiesSource = (admin = false) => (admin
  ? collection(db, collectionName)
  : query(collection(db, collectionName), where('publicationStatus', '==', 'published')));

const propertiesFromSnapshot = (snapshot, admin = false) => sortProperties(
  snapshot.docs.map((item) => normalize({ id: item.id, ...item.data() })),
  admin,
);

export async function getProperties({ admin = false } = {}) {
  if (!firebaseEnabled) return sortProperties(demoProperties.map(normalize), admin);

  const snapshot = await getDocs(propertiesSource(admin));
  return propertiesFromSnapshot(snapshot, admin);
}

export function subscribeProperties({ admin = false } = {}, onData, onError) {
  if (typeof onData !== 'function') return () => {};

  if (!firebaseEnabled) {
    onData(sortProperties(demoProperties.map(normalize), admin));
    return () => {};
  }

  return onSnapshot(
    propertiesSource(admin),
    (snapshot) => onData(propertiesFromSnapshot(snapshot, admin)),
    (error) => {
      if (typeof onError === 'function') onError(error);
    },
  );
}

export async function getProperty(id) {
  if (!firebaseEnabled) {
    const property = demoProperties.find((item) => item.id === id || item.slug === id);
    return property ? normalize(property) : null;
  }
  const snapshot = await getDoc(doc(db, collectionName, id));
  return snapshot.exists() ? normalize({ id: snapshot.id, ...snapshot.data() }) : null;
}

export async function saveProperty(data, id, uid) {
  const payload = { ...data, updatedBy: uid || data.updatedBy || '', updatedAt: serverTimestamp() };
  const hasStructuredAmenities = hasOwn(data, 'features') || hasOwn(data, 'services');

  if (hasStructuredAmenities) {
    const features = asList(data.features);
    const services = asList(data.services);
    payload.features = features;
    payload.services = services;
    payload.amenities = [...new Set([...features, ...services])];
  }

  delete payload._hasStructuredAmenities;

  if (payload.publicationStatus === 'published' && !payload.publishedAt) {
    payload.publishedAt = serverTimestamp();
  }

  if (!firebaseEnabled) return { id: id || crypto.randomUUID(), ...payload };

  if (id) {
    const propertyRef = doc(db, collectionName, id);
    const existing = await getDoc(propertyRef);
    const dataToSave = existing.exists()
      ? payload
      : {
        ...payload,
        createdBy: uid || '',
        createdAt: serverTimestamp(),
      };
    await setDoc(propertyRef, dataToSave, { merge: true });
    return { id };
  }

  return addDoc(collection(db, collectionName), {
    ...payload,
    createdBy: uid || '',
    createdAt: serverTimestamp(),
  });
}

export async function updatePropertyStatus(id, changes, uid) {
  return saveProperty(changes, id, uid);
}

export async function duplicateProperty(property, uid) {
  const excludedFields = new Set(['id', 'createdAt', 'updatedAt', 'publishedAt']);
  const copy = Object.fromEntries(
    Object.entries(property).filter(([key]) => !excludedFields.has(key)),
  );

  return saveProperty({
    ...copy,
    title: `${property.title} (copia)`,
    slug: `${property.slug || property.title}-copia-${Date.now()}`,
    publicationStatus: 'draft',
    published: false,
    status: 'available',
    featured: false,
  }, null, uid);
}

export async function deleteProperty(id, images = []) {
  if (firebaseEnabled) {
    await Promise.all(
      asImages(images).map((image) => deleteStorageFile(image?.path).catch(() => null)),
    );
  }
  if (!firebaseEnabled) return true;
  return deleteDoc(doc(db, collectionName, id));
}
