import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  deleteProperty,
  duplicateProperty,
  getProperties,
  getProperty,
  saveProperty,
  updatePropertyStatus,
} from '../../services/propertyService';
import { deleteStorageFile, uploadPropertyImage } from '../../services/storageService';
import { getSiteContent, saveSiteContent } from '../../services/siteContentService';
import { getInquiries, updateInquiryStatus } from '../../services/inquiryService';
import { useAuth } from '../../contexts/AuthContext';
import { runFirebaseDiagnostic } from '../../services/firebaseDiagnosticService';
import { firebaseProjectId } from '../../firebase/firebase';
import { slugify } from '../../utils/format';
import {
  contentFieldLabels,
  contentSectionLabels,
  currencyOptions,
  inquiryStatusLabels,
  labelFor,
  operationTypeOptions,
  propertyStatusOptions,
  propertyTypeOptions,
  publicationStatusOptions,
} from '../../config/adminLabels.es';

const emptyProperty = {
  title: '',
  slug: '',
  internalCode: '',
  description: '',
  price: '',
  currency: 'USD',
  operationType: 'sale',
  propertyType: 'house',
  status: 'available',
  publicationStatus: 'draft',
  department: '',
  city: '',
  sector: '',
  publicAddress: '',
  privateAddress: '',
  latitude: '',
  longitude: '',
  landArea: '',
  constructionArea: '',
  bedrooms: '',
  bathrooms: '',
  parkingSpaces: '',
  features: [],
  services: [],
  coverImage: '',
  images: [],
  videoUrl: '',
  featured: false,
  displayOrder: 0,
};

const contentSections = {
  home: [
    'heroTitle',
    'heroSubtitle',
    'heroLabel',
    'aboutTitle',
    'aboutText',
    'strategicTitle',
    'strategicLabel',
  ],
  about: ['title', 'subtitle', 'biography', 'mission', 'values'],
  contact: ['phone', 'whatsapp', 'email', 'address', 'schedule', 'facebook', 'instagram', 'tiktok'],
};

const formatDate = (value) => {
  if (!value) return '—';
  if (value?.toDate) return value.toDate().toLocaleDateString('es-NI');
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString('es-NI');
};

const formatPrice = (price, currency = 'USD') =>
  new Intl.NumberFormat('es-NI', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(price || 0));

const numericOrNull = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

function SelectField({ label, value, options, onChange, required = false, help }) {
  return (
    <label>
      {label}
      <select value={value ?? ''} onChange={(event) => onChange(event.target.value)} required={required}>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
      {help && <small className="admin-help">{help}</small>}
    </label>
  );
}

function TextField({ label, value, onChange, type = 'text', placeholder, required = false, help }) {
  return (
    <label>
      {label}
      <input
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
      {help && <small className="admin-help">{help}</small>}
    </label>
  );
}

export function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getProperties({ admin: true }), getInquiries()])
      .then(([propertyItems, inquiryItems]) => {
        setProperties(propertyItems);
        setInquiries(inquiryItems);
      })
      .catch(() => setError('No se pudieron cargar los datos del panel en este momento.'))
      .finally(() => setLoading(false));
  }, []);

  const stat = (label, value) => (
    <article className="stat">
      <b>{loading ? '...' : value}</b>
      <span>{label}</span>
    </article>
  );

  const recentItems = [...properties, ...inquiries].slice(0, 6);

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">Resumen general</p>
          <h1>Panel principal</h1>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="grid four">
        {stat('Total de propiedades', properties.length)}
        {stat('Propiedades publicadas', properties.filter((item) => item.publicationStatus === 'published').length)}
        {stat('Propiedades en borrador', properties.filter((item) => item.publicationStatus === 'draft').length)}
        {stat('Propiedades vendidas', properties.filter((item) => item.status === 'sold').length)}
        {stat('Consultas pendientes', inquiries.filter((item) => item.status === 'new').length)}
      </div>

      <div className="quick-actions">
        <Link className="btn primary" to="/admin/properties/new">Agregar propiedad</Link>
        <Link className="btn" to="/admin/properties">Administrar propiedades</Link>
        <Link className="btn" to="/admin/content">Editar contenido público</Link>
        <Link className="btn" to="/admin/inquiries">Revisar consultas</Link>
      </div>

      <section className="admin-card">
        <h2>Actividad reciente</h2>
        {recentItems.length ? (
          recentItems.map((item) => (
            <p key={item.id}>
              {item.title || item.name || 'Registro'} · {formatDate(item.updatedAt || item.createdAt)}
            </p>
          ))
        ) : (
          <p className="empty">Todavía no hay actividad reciente.</p>
        )}
      </section>
    </>
  );
}

export function AdminProperties() {
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

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">Inventario inmobiliario</p>
          <h1>Administrar propiedades</h1>
          <p>Crea, edita, publica, despublica y organiza las propiedades de la web.</p>
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
                      <img className="thumb" src={property.coverImage} alt={`Portada de ${property.title}`} />
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
                  <td>{formatPrice(property.price, property.currency)}</td>
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

export function PropertyEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyProperty);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    getProperty(id)
      .then((property) => {
        if (property) setForm({ ...emptyProperty, ...property });
        else setError('No se encontró la propiedad solicitada.');
      })
      .catch(() => setError('No se pudo cargar la propiedad.'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setArray = (key, value) => set(key, value.split(',').map((item) => item.trim()).filter(Boolean));

  const submit = async (publicationStatus) => {
    if (!form.title.trim()) {
      setError('Debes escribir el título de la propiedad.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    const data = {
      ...form,
      slug: form.slug.trim() || slugify(form.title),
      publicationStatus: publicationStatus || form.publicationStatus,
      price: Number(form.price || 0),
      latitude: numericOrNull(form.latitude),
      longitude: numericOrNull(form.longitude),
      landArea: numericOrNull(form.landArea),
      constructionArea: numericOrNull(form.constructionArea),
      bedrooms: numericOrNull(form.bedrooms),
      bathrooms: numericOrNull(form.bathrooms),
      parkingSpaces: numericOrNull(form.parkingSpaces),
      displayOrder: Number(form.displayOrder || 0),
      featured: Boolean(form.featured),
    };

    try {
      const result = await saveProperty(data, id, user?.uid);
      setMessage(publicationStatus === 'published'
        ? 'Propiedad publicada correctamente.'
        : 'Propiedad guardada correctamente.');

      if (!id && result?.id) navigate(`/admin/properties/${result.id}/edit`, { replace: true });
    } catch (saveError) {
      setError(saveError?.message || 'No se pudo guardar la propiedad. Revisa los permisos de Firestore.');
    } finally {
      setSaving(false);
    }
  };

  const uploadFiles = async (files) => {
    if (!files.length) return;
    const propertyId = id || crypto.randomUUID();
    setError('');

    try {
      const uploaded = [];
      for (const file of files) {
        uploaded.push(await uploadPropertyImage(propertyId, file, setProgress));
      }
      setForm((current) => ({
        ...current,
        images: [...(current.images || []), ...uploaded],
        coverImage: current.coverImage || uploaded[0]?.url || '',
      }));
      setProgress(0);
    } catch (uploadError) {
      setError(uploadError?.message || 'No se pudieron subir las fotografías.');
      setProgress(0);
    }
  };

  const moveImage = (index, direction) => {
    const destination = index + direction;
    if (destination < 0 || destination >= form.images.length) return;
    const next = [...form.images];
    const [selected] = next.splice(index, 1);
    next.splice(destination, 0, selected);
    set('images', next);
  };

  const removeImage = async (image) => {
    if (!window.confirm('¿Eliminar esta fotografía?')) return;
    try {
      await deleteStorageFile(image.path);
      const nextImages = form.images.filter((item) => item.url !== image.url);
      setForm((current) => ({
        ...current,
        images: nextImages,
        coverImage: current.coverImage === image.url ? nextImages[0]?.url || '' : current.coverImage,
      }));
    } catch {
      setError('No se pudo eliminar la fotografía.');
    }
  };

  if (loading) return <p>Cargando propiedad...</p>;

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">Inventario inmobiliario</p>
          <h1>{id ? 'Editar propiedad' : 'Agregar nueva propiedad'}</h1>
          <p>Completa la información que aparecerá en la web pública.</p>
        </div>
        <Link className="btn secondary" to="/admin/properties">Volver al listado</Link>
      </div>

      <form className="admin-form admin-property-form" onSubmit={(event) => { event.preventDefault(); submit(); }}>
        <fieldset className="admin-form-section">
          <legend>Información principal</legend>
          <div className="admin-form-grid">
            <TextField
              label="Título de la propiedad"
              value={form.title}
              onChange={(value) => set('title', value)}
              placeholder="Ej. Casa moderna en Matagalpa"
              required
            />
            <TextField
              label="Código interno"
              value={form.internalCode}
              onChange={(value) => set('internalCode', value)}
              placeholder="Ej. AMY-001"
            />
            <TextField
              label="Enlace amigable (URL)"
              value={form.slug}
              onChange={(value) => set('slug', value)}
              placeholder="Se genera automáticamente si se deja vacío"
              help="Utiliza letras minúsculas y guiones. Ejemplo: casa-moderna-matagalpa."
            />
            <TextField
              label="Enlace de video"
              value={form.videoUrl}
              onChange={(value) => set('videoUrl', value)}
              placeholder="https://..."
              type="url"
            />
            <label className="admin-field-full">
              Descripción de la propiedad
              <textarea
                value={form.description}
                onChange={(event) => set('description', event.target.value)}
                placeholder="Describe la propiedad, sus ventajas, distribución, ubicación y potencial. Los saltos de línea se conservarán."
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="admin-form-section">
          <legend>Venta, alquiler y publicación</legend>
          <div className="admin-form-grid">
            <TextField
              label="Precio"
              value={form.price}
              onChange={(value) => set('price', value)}
              type="number"
              placeholder="0"
              required
            />
            <SelectField label="Moneda" value={form.currency} options={currencyOptions} onChange={(value) => set('currency', value)} />
            <SelectField label="Tipo de operación" value={form.operationType} options={operationTypeOptions} onChange={(value) => set('operationType', value)} required />
            <SelectField label="Tipo de propiedad" value={form.propertyType} options={propertyTypeOptions} onChange={(value) => set('propertyType', value)} required />
            <SelectField label="Estado comercial" value={form.status} options={propertyStatusOptions} onChange={(value) => set('status', value)} />
            <SelectField
              label="Estado de publicación"
              value={form.publicationStatus}
              options={publicationStatusOptions}
              onChange={(value) => set('publicationStatus', value)}
              help="Borrador no aparece en la web. Publicada sí es visible. Archivada se conserva solamente en el panel."
            />
            <TextField
              label="Orden de aparición"
              value={form.displayOrder}
              onChange={(value) => set('displayOrder', value)}
              type="number"
              placeholder="0"
              help="Los números menores aparecen primero."
            />
            <label className="admin-checkbox-field">
              <input type="checkbox" checked={form.featured} onChange={(event) => set('featured', event.target.checked)} />
              <span>
                <strong>Destacar en la página de inicio</strong>
                <small>La propiedad podrá aparecer en la sección de propiedades destacadas.</small>
              </span>
            </label>
          </div>
        </fieldset>

        <fieldset className="admin-form-section">
          <legend>Ubicación</legend>
          <div className="admin-form-grid">
            <TextField label="Departamento" value={form.department} onChange={(value) => set('department', value)} placeholder="Ej. Matagalpa" />
            <TextField label="Ciudad o municipio" value={form.city} onChange={(value) => set('city', value)} placeholder="Ej. Matagalpa" />
            <TextField label="Sector, barrio o residencial" value={form.sector} onChange={(value) => set('sector', value)} placeholder="Ej. Molino Norte" />
            <TextField label="Dirección pública" value={form.publicAddress} onChange={(value) => set('publicAddress', value)} placeholder="Referencia que puede mostrarse en la web" />
            <TextField label="Dirección privada" value={form.privateAddress} onChange={(value) => set('privateAddress', value)} placeholder="Información interna que no debe mostrarse públicamente" />
            <TextField label="Latitud" value={form.latitude} onChange={(value) => set('latitude', value)} type="number" placeholder="12.9256" help="Déjala vacía si todavía no tienes la ubicación exacta." />
            <TextField label="Longitud" value={form.longitude} onChange={(value) => set('longitude', value)} type="number" placeholder="-85.9175" help="Déjala vacía si todavía no tienes la ubicación exacta." />
          </div>
        </fieldset>

        <fieldset className="admin-form-section">
          <legend>Medidas y distribución</legend>
          <div className="admin-form-grid">
            <TextField label="Área del terreno" value={form.landArea} onChange={(value) => set('landArea', value)} type="number" placeholder="0" help="Ingresa el valor numérico según la unidad utilizada en la descripción." />
            <TextField label="Área de construcción" value={form.constructionArea} onChange={(value) => set('constructionArea', value)} type="number" placeholder="0" />
            <TextField label="Habitaciones" value={form.bedrooms} onChange={(value) => set('bedrooms', value)} type="number" placeholder="0" />
            <TextField label="Baños" value={form.bathrooms} onChange={(value) => set('bathrooms', value)} type="number" placeholder="0" />
            <TextField label="Estacionamientos" value={form.parkingSpaces} onChange={(value) => set('parkingSpaces', value)} type="number" placeholder="0" />
          </div>
        </fieldset>

        <fieldset className="admin-form-section">
          <legend>Características y servicios</legend>
          <div className="admin-form-grid">
            <label>
              Características principales
              <input
                value={(form.features || []).join(', ')}
                onChange={(event) => setArray('features', event.target.value)}
                placeholder="Piscina, terraza, jardín, vista panorámica"
              />
              <small className="admin-help">Separa cada característica con una coma.</small>
            </label>
            <label>
              Servicios disponibles
              <input
                value={(form.services || []).join(', ')}
                onChange={(event) => setArray('services', event.target.value)}
                placeholder="Agua potable, energía eléctrica, internet"
              />
              <small className="admin-help">Separa cada servicio con una coma.</small>
            </label>
          </div>
        </fieldset>

        <fieldset className="admin-form-section admin-field-full">
          <legend>Fotografías</legend>
          <label className="admin-upload-field">
            Subir fotografías de la propiedad
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => uploadFiles([...event.target.files])}
            />
            <small className="admin-help">Formatos permitidos: JPG, PNG y WEBP. Puedes seleccionar varias imágenes.</small>
          </label>

          {progress > 0 && progress < 100 && (
            <div className="admin-upload-progress">
              <span>Subiendo fotografías: {progress}%</span>
              <progress value={progress} max="100" />
            </div>
          )}

          <div className="image-manager">
            {(form.images || []).map((image, index) => (
              <article key={image.url}>
                <img src={image.url} alt={`Fotografía ${index + 1} de la propiedad`} />
                <p>{form.coverImage === image.url ? 'Imagen de portada' : `Fotografía ${index + 1}`}</p>
                <button type="button" onClick={() => set('coverImage', image.url)}>
                  {form.coverImage === image.url ? 'Portada seleccionada' : 'Usar como portada'}
                </button>
                <div className="image-manager__order">
                  <button type="button" disabled={index === 0} onClick={() => moveImage(index, -1)}>Mover antes</button>
                  <button type="button" disabled={index === form.images.length - 1} onClick={() => moveImage(index, 1)}>Mover después</button>
                </div>
                <button type="button" className="danger-action" onClick={() => removeImage(image)}>Eliminar fotografía</button>
              </article>
            ))}
          </div>

          {!form.images.length && <p className="empty">Todavía no se han agregado fotografías.</p>}
        </fieldset>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <div className="quick-actions admin-form-actions">
          <button className="btn" type="button" disabled={saving} onClick={() => submit('draft')}>
            {saving ? 'Guardando...' : 'Guardar como borrador'}
          </button>
          <button className="btn primary" type="button" disabled={saving} onClick={() => submit('published')}>
            {saving ? 'Guardando...' : 'Guardar y publicar'}
          </button>
          <button className="btn secondary" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </>
  );
}

export function ContentAdmin() {
  const [tab, setTab] = useState('home');
  const [data, setData] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMessage('');
    setError('');
    getSiteContent(tab)
      .then(setData)
      .catch(() => setError('No se pudo cargar el contenido de esta sección.'));
  }, [tab]);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await saveSiteContent(tab, data);
      setMessage('Contenido guardado correctamente.');
    } catch {
      setError('No se pudo guardar el contenido.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">Web pública</p>
          <h1>Editar contenido de la web</h1>
          <p>Modifica los textos principales sin tocar el código.</p>
        </div>
      </div>

      <div className="quick-actions admin-tabs">
        {Object.keys(contentSections).map((section) => (
          <button
            key={section}
            type="button"
            className={`btn ${tab === section ? 'primary' : 'secondary'}`}
            onClick={() => setTab(section)}
          >
            {contentSectionLabels[section]}
          </button>
        ))}
      </div>

      <form className="admin-form" onSubmit={save}>
        {contentSections[tab].map((field) => {
          const isSocialUrl = ['facebook', 'instagram', 'tiktok'].includes(field);
          return (
            <label key={field}>
              {contentFieldLabels[field] || field}
              {isSocialUrl ? (
                <>
                  <input
                    type="url"
                    value={data[field] || ''}
                    onChange={(event) => setData((current) => ({ ...current, [field]: event.target.value }))}
                    placeholder={`https://${field}.com/usuario`}
                  />
                  <small className="admin-help">Pega el enlace completo del perfil, incluyendo https://</small>
                </>
              ) : (
                <textarea
                  value={data[field] || ''}
                  onChange={(event) => setData((current) => ({ ...current, [field]: event.target.value }))}
                />
              )}
            </label>
          );
        })}
        <button className="btn primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar contenido'}</button>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </>
  );
}

export function InquiriesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    return getInquiries()
      .then(setItems)
      .catch(() => setError('No se pudieron cargar las consultas.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await updateInquiryStatus(id, status);
      await load();
    } catch {
      setError('No se pudo actualizar la consulta.');
    }
  };

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">Solicitudes recibidas</p>
          <h1>Consultas de clientes</h1>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Cargando consultas...</p>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Datos de contacto</th>
                <th>Propiedad relacionada</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Notas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>{inquiry.name || 'Sin nombre'}</td>
                  <td>{inquiry.email}<br />{inquiry.phone}</td>
                  <td>{inquiry.propertyId || 'Consulta general'}</td>
                  <td>{formatDate(inquiry.createdAt)}</td>
                  <td>{inquiryStatusLabels[inquiry.status] || inquiry.status || 'Nueva'}</td>
                  <td>{inquiry.notes || 'Sin notas'}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" onClick={() => changeStatus(inquiry.id, 'contacted')}>Marcar contactada</button>
                      <button type="button" onClick={() => changeStatus(inquiry.id, 'resolved')}>Marcar resuelta</button>
                      <button type="button" onClick={() => changeStatus(inquiry.id, 'archived')}>Archivar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && <p className="empty">Todavía no hay consultas registradas.</p>}
        </div>
      )}
    </>
  );
}

export function SettingsAdmin() {
  const { user, adminAccess, authStatus } = useAuth();
  const [diagnostic, setDiagnostic] = useState(null);
  const [loading, setLoading] = useState(false);

  const test = async () => {
    setLoading(true);
    setDiagnostic(await runFirebaseDiagnostic(user));
    setLoading(false);
  };

  useEffect(() => {
    test();
  }, [user?.uid]);

  const row = (label, value) => <p><strong>{label}:</strong> {value || '—'}</p>;

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="admin-eyebrow">Sistema</p>
          <h1>Configuración</h1>
        </div>
      </div>

      <section className="admin-card">
        <h2>Estado de conexión con Firebase</h2>
        {row('Proyecto', diagnostic?.projectId || firebaseProjectId)}
        {row('Aplicación', diagnostic?.appConnected ? 'Conectada' : 'No conectada')}
        {row('Autenticación', diagnostic?.authAvailable ? 'Disponible' : 'No disponible')}
        {row('Base de datos Firestore', diagnostic?.firestore)}
        {row('Almacenamiento de archivos', diagnostic?.storage)}
        {row('Usuario conectado', diagnostic?.userEmail)}
        {row('Identificador del usuario (UID)', diagnostic?.uid)}
        {row('Rol', diagnostic?.role)}
        {row('Estado del acceso', authStatus)}
        {row('Perfil administrativo users/{uid}', diagnostic?.userDocument)}

        {adminAccess?.bootstrapWrite?.reason === 'permission-denied' && (
          <p className="notice">No se pudo crear el perfil users/{`{uid}`}. Deben publicarse las reglas de Firestore incluidas en el repositorio.</p>
        )}
        {diagnostic?.permissionError && <p className="error">{diagnostic.permissionError}</p>}
        {diagnostic?.legacyEmailDocument && (
          <p className="notice">{diagnostic.migrationMessage} UID correcto: {diagnostic.uid}</p>
        )}

        <button className="btn primary" type="button" onClick={test} disabled={loading}>
          {loading ? 'Comprobando conexión...' : 'Comprobar conexión'}
        </button>
      </section>
    </>
  );
}
