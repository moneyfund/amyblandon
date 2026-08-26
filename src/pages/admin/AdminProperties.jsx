import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, FileDown, Search, X } from 'lucide-react';
import {
  deleteProperty,
  duplicateProperty,
  getProperties,
  updatePropertyStatus,
} from '../../services/propertyService';
import { useAuth } from '../../contexts/AuthContext';
import {
  labelFor,
  operationTypeOptions,
  propertyStatusOptions,
  propertyTypeOptions,
  publicationStatusOptions,
} from '../../config/adminLabels.es';
import { downloadPropertyTechnicalSheetPdf } from '../../utils/propertyTechnicalSheetPdf';

const IMAGE_TIMEOUT_MS = 7000;
const PDF_TIMEOUT_MS = 25000;
const VERCEL_IMAGE_PROXY = 'https://amyblandon.vercel.app/api/property-image';

const withTimeout = (promise, timeoutMs, message) => new Promise((resolve, reject) => {
  const timer = window.setTimeout(() => reject(new Error(message)), timeoutMs);
  promise.then((value) => {
    window.clearTimeout(timer);
    resolve(value);
  }).catch((error) => {
    window.clearTimeout(timer);
    reject(error);
  });
});

const isGithubPagesRuntime = () => (
  typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')
);

const imageProxyEndpoint = () => (
  isGithubPagesRuntime() ? VERCEL_IMAGE_PROXY : '/api/property-image'
);

const formatDate = (value) => {
  if (!value) return '—';
  if (value?.toDate) return value.toDate().toLocaleDateString('es-NI');
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString('es-NI');
};

const formatPrice = (property) => {
  if (property.priceOnRequest) return 'Consultar';
  try {
    return new Intl.NumberFormat('es-NI', {
      style: 'currency',
      currency: property.currency || 'USD',
      maximumFractionDigits: 0,
    }).format(Number(property.price || 0));
  } catch {
    return `$${Number(property.price || 0).toLocaleString('en-US')}`;
  }
};

const normalizeOperation = (value) => {
  if (value === 'venta') return 'sale';
  if (value === 'renta') return 'rent';
  return value;
};

const asImageMeta = (image) => {
  if (!image) return null;
  if (typeof image === 'string') return { url: image, path: '', type: '' };
  return image;
};

const getPdfImageCandidates = (property) => {
  const gallery = (Array.isArray(property.images) ? property.images : [property.images])
    .map(asImageMeta)
    .filter(Boolean);
  const cover = asImageMeta(property.coverImage);
  const coverWithStorageMeta = gallery.find((image) => cover?.url && image.url === cover.url) || cover;
  const seen = new Set();

  return [coverWithStorageMeta, ...gallery].filter((image) => {
    if (!image?.url) return false;
    if (seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
};

const fetchImageViaProxy = async (url) => {
  if (!url) throw new Error('La fotografía no tiene URL pública.');

  const endpoint = imageProxyEndpoint();
  const proxyUrl = `${endpoint}?url=${encodeURIComponent(url)}`;
  const response = await withTimeout(
    fetch(proxyUrl, {
      cache: 'no-store',
      mode: 'cors',
      credentials: 'omit',
    }),
    IMAGE_TIMEOUT_MS,
    'El servidor tardó demasiado en recuperar una fotografía.',
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const detail = payload?.error ? ` ${payload.error}` : '';
    throw new Error(`El proxy de imágenes respondió ${response.status}.${detail}`);
  }

  const blob = await withTimeout(
    response.blob(),
    IMAGE_TIMEOUT_MS,
    'La fotografía tardó demasiado en descargarse.',
  );

  if (blob.type && !blob.type.startsWith('image/')) {
    throw new Error(`El proxy devolvió un archivo no válido (${blob.type || 'sin tipo'}).`);
  }
  return blob;
};

const blobToImageElement = async (blob) => {
  const objectUrl = URL.createObjectURL(blob);
  const image = new Image();
  image.decoding = 'async';

  try {
    await withTimeout(
      new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error('El navegador no pudo decodificar la fotografía.'));
        image.src = objectUrl;
      }),
      IMAGE_TIMEOUT_MS,
      'La fotografía tardó demasiado en decodificarse.',
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }

  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error('La fotografía se descargó, pero no contiene dimensiones válidas.');
  }
  return image;
};

const decodeImageForPdf = async (image) => {
  if (!image?.url) throw new Error('La fotografía no tiene una URL utilizable.');
  const blob = await fetchImageViaProxy(image.url);
  if (!blob.type.startsWith('image/')) throw new Error('El archivo descargado no es una imagen.');
  return blobToImageElement(blob);
};

export default function AdminProperties() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [operationType, setOperationType] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfGeneratingId, setPdfGeneratingId] = useState('');
  const { user } = useAuth();

  const load = () => {
    setLoading(true);
    setError('');
    return getProperties({ admin: true })
      .then(setItems)
      .catch(() => setError('No se pudieron cargar las propiedades. Revisa la conexión con Firestore.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => items.filter((property) => {
      const searchable = [
        property.title,
        property.internalCode,
        property.city,
        property.state,
        property.department,
        property.sector,
        property.address,
        property.publicAddress,
        property.propertyType,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const currentOperation = normalizeOperation(property.operationType || property.transactionType);

      return (!search || searchable.includes(search.toLowerCase().trim()))
        && (!operationType || currentOperation === operationType)
        && (!propertyType || property.propertyType === propertyType);
    }),
    [items, search, operationType, propertyType],
  );

  const hasSearch = Boolean(search || operationType || propertyType);
  const clearSearch = () => {
    setSearch('');
    setOperationType('');
    setPropertyType('');
  };

  const remove = async (property) => {
    if (!window.confirm(`¿Eliminar definitivamente “${property.title}” y sus fotografías?`)) return;
    try {
      await deleteProperty(property.id, property.images);
      await load();
    } catch {
      setError('No se pudo eliminar la propiedad. Revisa los permisos de Firestore y Storage.');
    }
  };

  const duplicate = async (property) => {
    try {
      await duplicateProperty(property, user?.uid);
      await load();
    } catch {
      setError('No se pudo duplicar la propiedad.');
    }
  };

  const togglePublication = async (property) => {
    const nextStatus = property.publicationStatus === 'published' ? 'draft' : 'published';
    try {
      await updatePropertyStatus(property.id, { publicationStatus: nextStatus }, user?.uid);
      await load();
    } catch {
      setError('No se pudo cambiar el estado de publicación.');
    }
  };

  const downloadTechnicalSheet = async (property) => {
    if (pdfGeneratingId) return;
    setPdfGeneratingId(property.id);
    setError('');
    let decodedImages = [];

    try {
      const candidates = getPdfImageCandidates(property).slice(0, 6);
      if (!candidates.length) {
        throw new Error('Esta propiedad no tiene fotografías disponibles para la ficha técnica.');
      }

      const results = await withTimeout(
        Promise.allSettled(candidates.map((candidate) => decodeImageForPdf(candidate))),
        18000,
        'La preparación de las fotografías excedió el tiempo permitido.',
      );
      decodedImages = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value)
        .slice(0, 3);

      results
        .filter((result) => result.status === 'rejected')
        .forEach((result) => console.warn('No se pudo preparar una fotografía para la ficha técnica.', result.reason));

      if (!decodedImages.length) {
        throw new Error('No se pudo cargar ninguna fotografía mediante el servidor seguro de imágenes. Vuelve a intentarlo o revisa que las fotografías sigan disponibles.');
      }

      await withTimeout(
        downloadPropertyTechnicalSheetPdf({
          ...property,
          pdfGalleryBitmaps: decodedImages,
        }),
        PDF_TIMEOUT_MS,
        'La generación del PDF excedió 25 segundos y fue cancelada. Inténtalo nuevamente.',
      );
    } catch (pdfError) {
      setError(pdfError?.message || 'No se pudo generar la ficha técnica de esta propiedad.');
    } finally {
      decodedImages.forEach((image) => {
        image.onload = null;
        image.onerror = null;
        image.src = '';
      });
      setPdfGeneratingId('');
    }
  };

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">Inventario inmobiliario</p>
          <h1>Administrar propiedades</h1>
          <p>Crea, edita, publica, organiza y descarga las fichas técnicas de las propiedades de Amy.</p>
        </div>
        <Link className="btn primary" to="/admin/properties/new">Agregar propiedad</Link>
      </div>

      <section className="admin-property-searchbar" aria-label="Buscar propiedades">
        <label className="admin-property-searchbar__keyword">
          <Search size={20} aria-hidden="true" />
          <span>
            <small>¿Dónde quieres buscar?</small>
            <input
              placeholder="Ciudad, zona o nombre de propiedad"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Ubicación o palabra clave"
            />
          </span>
        </label>

        <label className="admin-property-searchbar__select">
          <small>Operación</small>
          <select value={operationType} onChange={(event) => setOperationType(event.target.value)} aria-label="Tipo de operación">
            <option value="">Venta y alquiler</option>
            {operationTypeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>

        <label className="admin-property-searchbar__select admin-property-searchbar__select--type">
          <Building2 size={18} aria-hidden="true" />
          <span>
            <small>Tipo de propiedad</small>
            <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
              <option value="">Propiedades</option>
              {propertyTypeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </span>
        </label>

        {hasSearch && (
          <button type="button" className="admin-property-searchbar__clear" onClick={clearSearch} aria-label="Limpiar búsqueda" title="Limpiar búsqueda">
            <X size={18} />
          </button>
        )}
      </section>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Cargando propiedades...</p>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Código</th>
                <th>Propiedad</th>
                <th>Ubicación</th>
                <th>Precio</th>
                <th>Operación</th>
                <th>Estado</th>
                <th>Publicación</th>
                <th>Última actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((property) => (
                <tr key={property.id}>
                  <td>
                    {property.coverImage ? (
                      <img className="thumb" src={typeof property.coverImage === 'string' ? property.coverImage : property.coverImage?.url} alt={`Portada de ${property.title}`} />
                    ) : (
                      <span className="admin-no-image">Sin imagen</span>
                    )}
                  </td>
                  <td>{property.internalCode || '—'}</td>
                  <td>
                    <strong>{property.title || 'Propiedad sin título'}</strong>
                    <small>{labelFor(propertyTypeOptions, property.propertyType)}</small>
                  </td>
                  <td>{[property.city, property.sector].filter(Boolean).join(', ') || '—'}</td>
                  <td>{formatPrice(property)}</td>
                  <td>{labelFor(operationTypeOptions, normalizeOperation(property.operationType || property.transactionType))}</td>
                  <td>
                    <span className={`status-badge status-badge--${property.status || 'unknown'}`}>
                      {labelFor(propertyStatusOptions, property.status)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${property.publicationStatus || 'unknown'}`}>
                      {labelFor(publicationStatusOptions, property.publicationStatus)}
                    </span>
                  </td>
                  <td>{formatDate(property.updatedAt)}</td>
                  <td>
                    <div className="admin-row-actions">
                      <Link to={`/admin/properties/${property.id}/edit`}>Editar</Link>
                      <button
                        type="button"
                        className="admin-tech-sheet-action"
                        onClick={() => downloadTechnicalSheet(property)}
                        disabled={Boolean(pdfGeneratingId)}
                        title="Descargar ficha técnica profesional en PDF"
                      >
                        <FileDown size={15} />
                        {pdfGeneratingId === property.id ? 'Generando…' : 'Ficha técnica PDF'}
                      </button>
                      <button type="button" onClick={() => duplicate(property)}>Duplicar</button>
                      <button type="button" onClick={() => togglePublication(property)}>
                        {property.publicationStatus === 'published' ? 'Despublicar' : 'Publicar'}
                      </button>
                      <button type="button" className="danger-action" onClick={() => remove(property)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!filtered.length && <p className="empty">No hay propiedades que coincidan con la búsqueda.</p>}
        </div>
      )}
    </>
  );
}
