import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileDown } from 'lucide-react';
import { getBytes, ref as storageRef } from 'firebase/storage';
import {
  deleteProperty,
  duplicateProperty,
  getProperties,
  updatePropertyStatus,
} from '../../services/propertyService';
import { useAuth } from '../../contexts/AuthContext';
import { firebaseEnabled, storage } from '../../firebase/firebase';
import {
  labelFor,
  operationTypeOptions,
  propertyStatusOptions,
  propertyTypeOptions,
  publicationStatusOptions,
} from '../../config/adminLabels.es';
import { downloadPropertyTechnicalSheetPdf } from '../../utils/propertyTechnicalSheetPdf';

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
  const coverWithStorageMeta = cover?.path
    ? cover
    : gallery.find((image) => cover?.url && image.url === cover.url) || cover;
  const seen = new Set();

  return [coverWithStorageMeta, ...gallery].filter((image) => {
    if (!image?.path && !image?.url) return false;
    const key = image.path || image.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const imageToTemporaryUrl = async (image) => {
  let blob;
  if (image.path && firebaseEnabled && storage) {
    const bytes = await getBytes(storageRef(storage, image.path), 12 * 1024 * 1024);
    blob = new Blob([bytes], { type: image.type || 'image/jpeg' });
  } else if (image.url) {
    const response = await fetch(image.url, { mode: 'cors', cache: 'no-store' });
    if (!response.ok) throw new Error(`No se pudo descargar la imagen (${response.status}).`);
    blob = await response.blob();
  } else {
    throw new Error('La imagen no tiene una ubicación válida.');
  }

  if (blob.type && !blob.type.startsWith('image/')) throw new Error('El archivo descargado no es una imagen.');
  return URL.createObjectURL(blob);
};

export default function AdminProperties() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    operationType: '',
    status: '',
    publicationStatus: '',
  });
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
      const searchable = [property.title, property.internalCode, property.city, property.sector]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(search.toLowerCase())
        && Object.entries(filters).every(([key, value]) => !value || property[key] === value);
    }),
    [items, search, filters],
  );

  const changeFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

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
    const temporaryImageUrls = [];

    try {
      const candidates = getPdfImageCandidates(property);
      for (const candidate of candidates) {
        if (temporaryImageUrls.length === 3) break;
        try {
          temporaryImageUrls.push(await imageToTemporaryUrl(candidate));
        } catch (imageError) {
          console.warn('No se pudo preparar una fotografía para la ficha técnica.', imageError);
        }
      }

      await downloadPropertyTechnicalSheetPdf({
        ...property,
        pdfGalleryImages: temporaryImageUrls,
      });
    } catch (pdfError) {
      setError(pdfError?.message || 'No se pudo generar la ficha técnica de esta propiedad.');
    } finally {
      temporaryImageUrls.forEach((url) => URL.revokeObjectURL(url));
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

      <section className="admin-card admin-filters-card">
        <h2>Buscar y filtrar</h2>
        <div className="filters admin-property-filters">
          <input
            placeholder="Buscar por título, código, ciudad o sector"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Buscar propiedades"
          />

          <select value={filters.propertyType} onChange={(event) => changeFilter('propertyType', event.target.value)}>
            <option value="">Todos los tipos de propiedad</option>
            {propertyTypeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>

          <select value={filters.operationType} onChange={(event) => changeFilter('operationType', event.target.value)}>
            <option value="">Venta y alquiler</option>
            {operationTypeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>

          <select value={filters.status} onChange={(event) => changeFilter('status', event.target.value)}>
            <option value="">Todos los estados comerciales</option>
            {propertyStatusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>

          <select value={filters.publicationStatus} onChange={(event) => changeFilter('publicationStatus', event.target.value)}>
            <option value="">Todos los estados de publicación</option>
            {publicationStatusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>

          <button
            type="button"
            className="btn secondary"
            onClick={() => {
              setSearch('');
              setFilters({ propertyType: '', operationType: '', status: '', publicationStatus: '' });
            }}
          >
            Limpiar filtros
          </button>
        </div>
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
                  <td>{labelFor(operationTypeOptions, property.operationType)}</td>
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

          {!filtered.length && <p className="empty">No hay propiedades que coincidan con la búsqueda y los filtros seleccionados.</p>}
        </div>
      )}
    </>
  );
}
