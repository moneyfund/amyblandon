import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  GripVertical,
  ImagePlus,
  Plus,
  Save,
  Send,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PropertyMapPicker from '../../components/admin/PropertyMapPicker';
import {
  areaUnitOptions,
  featurePresets,
  getDynamicFields,
  nicaraguaDepartments,
  propertySections,
  rentPeriodOptions,
  servicePresets,
} from '../../config/propertyWorkspace.es';
import {
  currencyOptions,
  operationTypeOptions,
  propertyStatusOptions,
  propertyTypeOptions,
  publicationStatusOptions,
} from '../../config/adminLabels.es';
import { useAuth } from '../../contexts/AuthContext';
import { getProperty, saveProperty } from '../../services/propertyService';
import { deleteStorageFile, uploadPropertyImage } from '../../services/storageService';
import { slugify } from '../../utils/format';

const visiblePropertySections = propertySections.filter(([key]) => key !== 'marketing');

const stepDescriptions = {
  basic: 'Identifica el inmueble y prepara la descripción principal.',
  commercial: 'Define operación, precio y condiciones de publicación.',
  location: 'Ubica la propiedad y coloca el marcador en el mapa.',
  details: 'Completa medidas, características y servicios disponibles.',
  media: 'Sube las fotografías, ordénalas y selecciona la portada.',
};

const createEmptyProperty = () => ({
  title: '',
  slug: '',
  internalCode: '',
  description: '',
  shortDescription: '',
  price: '',
  currency: 'USD',
  operationType: 'sale',
  rentPeriod: 'monthly',
  priceNegotiable: false,
  priceOnRequest: false,
  propertyType: 'house',
  status: 'available',
  publicationStatus: 'draft',
  department: '',
  city: '',
  sector: '',
  publicAddress: '',
  privateAddress: '',
  mapSearchLabel: '',
  latitude: '',
  longitude: '',
  landArea: '',
  constructionArea: '',
  areaUnit: 'm²',
  bedrooms: '',
  bathrooms: '',
  parkingSpaces: '',
  yearBuilt: '',
  features: [],
  services: [],
  amenities: [],
  highlightTags: [],
  propertyDetails: {},
  coverImage: '',
  images: [],
  videoUrl: '',
  virtualTourUrl: '',
  featured: false,
  displayOrder: 0,
  seoTitle: '',
  seoDescription: '',
});

const asList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
};

const asImage = (image) => {
  if (!image) return null;
  if (typeof image === 'string') return { url: image, path: '', name: 'Fotografía', size: 0, type: '' };
  if (!image.url && image.src) return { ...image, url: image.src };
  return image.url ? image : null;
};

const normalizeImages = (property = {}) => {
  const source = Array.isArray(property.images) ? property.images : property.images ? [property.images] : [];
  const images = source.map(asImage).filter(Boolean);
  const cover = property.coverImage || property.image || property.imagen || '';
  if (cover && !images.some((item) => item.url === cover)) images.unshift(asImage(cover));
  return images.filter(Boolean);
};

const numericOrNull = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const cleanUrl = (value) => String(value || '').trim();

function Field({ label, value, onChange, type = 'text', placeholder, help, required = false, min, step }) {
  return (
    <label className="property-workspace__field">
      <span>{label}{required && <b aria-hidden="true"> *</b>}</span>
      <input
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
      />
      {help && <small>{help}</small>}
    </label>
  );
}

function SelectField({ label, value, onChange, options, help, required = false }) {
  return (
    <label className="property-workspace__field">
      <span>{label}{required && <b aria-hidden="true"> *</b>}</span>
      <select value={value ?? ''} onChange={(event) => onChange(event.target.value)} required={required}>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>{optionLabel}</option>
        ))}
      </select>
      {help && <small>{help}</small>}
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, help, rows = 5, required = false }) {
  return (
    <label className="property-workspace__field property-workspace__field--full">
      <span>{label}{required && <b aria-hidden="true"> *</b>}</span>
      <textarea
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
      {help && <small>{help}</small>}
    </label>
  );
}

function DynamicField({ definition, value, onChange }) {
  if (definition.type === 'textarea') {
    return <TextAreaField label={definition.label} value={value} onChange={onChange} help={definition.help} rows={4} />;
  }

  if (definition.type === 'select') {
    return (
      <SelectField
        label={definition.label}
        value={value}
        onChange={onChange}
        options={[['', 'Seleccionar'], ...definition.options]}
        help={definition.help}
      />
    );
  }

  return (
    <Field
      label={definition.label}
      value={value}
      onChange={onChange}
      type={definition.type === 'number' ? 'number' : 'text'}
      min={definition.type === 'number' ? '0' : undefined}
      step={definition.type === 'number' ? 'any' : undefined}
      help={definition.help}
    />
  );
}

function ChoiceGrid({ title, items, selected, onToggle, limit, help }) {
  return (
    <div className="property-workspace__choice-block">
      <div className="property-workspace__choice-heading">
        <div>
          <h3>{title}</h3>
          {help && <p>{help}</p>}
        </div>
        {limit && <span>{selected.length}/{limit}</span>}
      </div>
      <div className="property-workspace__choices">
        {items.map((item) => {
          const value = Array.isArray(item) ? item[0] : item;
          const label = Array.isArray(item) ? item[1] : item;
          const active = selected.includes(value);
          return (
            <button
              key={value}
              type="button"
              className={active ? 'is-selected' : ''}
              onClick={() => onToggle(value)}
              aria-pressed={active}
            >
              {active && <CheckCircle2 size={16} />}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function normalizeLoadedProperty(property) {
  const images = normalizeImages(property);
  return {
    ...createEmptyProperty(),
    ...property,
    images,
    coverImage: property.coverImage || images[0]?.url || '',
    features: asList(property.features),
    services: asList(property.services),
    amenities: asList(property.amenities),
    highlightTags: asList(property.highlightTags),
    propertyDetails: property.propertyDetails && typeof property.propertyDetails === 'object'
      ? property.propertyDetails
      : {},
    areaUnit: property.areaUnit || property.propertyDetails?.areaUnit || 'm²',
    constructionArea: property.constructionArea ?? property.builtArea ?? '',
    publicAddress: property.publicAddress || property.address || '',
  };
}

function buildCompletion(form) {
  const checks = [
    Boolean(form.title?.trim()),
    Boolean(form.description?.trim()),
    Boolean(form.priceOnRequest || Number(form.price) > 0),
    Boolean(form.propertyType),
    Boolean(form.operationType),
    Boolean(form.department),
    Boolean(form.city?.trim()),
    Boolean(form.images?.length),
    Boolean(form.coverImage),
    Boolean(form.features?.length || form.services?.length),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function isStepComplete(form, key) {
  if (key === 'basic') return Boolean(form.title?.trim() && form.propertyType);
  if (key === 'commercial') return Boolean(form.operationType && (form.priceOnRequest || Number(form.price) > 0));
  if (key === 'location') return Boolean(form.department && form.city?.trim());
  if (key === 'details') {
    return Boolean(
      form.landArea
      || form.constructionArea
      || form.bedrooms
      || form.bathrooms
      || form.features?.length
      || form.services?.length
      || Object.values(form.propertyDetails || {}).some(Boolean)
    );
  }
  if (key === 'media') return Boolean(form.images?.length && form.coverImage);
  return false;
}

export default function PropertyWorkspace() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workingId] = useState(() => id || crypto.randomUUID());
  const [form, setForm] = useState(createEmptyProperty);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [customFeature, setCustomFeature] = useState('');
  const [customService, setCustomService] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(() => (id ? visiblePropertySections.length - 1 : 0));

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    getProperty(id)
      .then((property) => {
        if (!active) return;
        if (!property) {
          setError('No se encontró la propiedad solicitada.');
          return;
        }
        setForm(normalizeLoadedProperty(property));
        setDirty(false);
      })
      .catch(() => active && setError('No se pudo cargar la propiedad. Revisa la conexión con Firestore.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    const warn = (event) => {
      if (!dirty || saving) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, saving]);

  const dynamicFields = useMemo(() => getDynamicFields(form.propertyType), [form.propertyType]);
  const completion = useMemo(() => buildCompletion(form), [form]);
  const publicSlug = form.slug?.trim() || slugify(form.title || 'propiedad');
  const [activeSectionKey, activeSectionLabel] = visiblePropertySections[activeStep];
  const wizardProgress = Math.round(((activeStep + 1) / visiblePropertySections.length) * 100);
  const isFinalStep = activeStep === visiblePropertySections.length - 1;

  const set = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setMessage('');
  };

  const setDetail = (key, value) => {
    setForm((current) => ({
      ...current,
      propertyDetails: { ...current.propertyDetails, [key]: value },
    }));
    setDirty(true);
    setMessage('');
  };

  const toggleListValue = (key, value, limit = Infinity) => {
    setForm((current) => {
      const list = asList(current[key]);
      const active = list.includes(value);
      if (!active && list.length >= limit) {
        setError(`Solo puedes seleccionar un máximo de ${limit} etiquetas destacadas.`);
        return current;
      }
      setError('');
      return { ...current, [key]: active ? list.filter((item) => item !== value) : [...list, value] };
    });
    setDirty(true);
  };

  const addCustomValue = (key, value, clear) => {
    const clean = value.trim();
    if (!clean) return;
    setForm((current) => ({
      ...current,
      [key]: [...new Set([...asList(current[key]), clean])],
    }));
    clear('');
    setDirty(true);
  };

  const removeListValue = (key, value) => {
    set(key, asList(form[key]).filter((item) => item !== value));
  };

  const generateInternalCode = () => {
    const typeCode = (form.propertyType || 'PROP').slice(0, 3).toUpperCase();
    const dateCode = new Date().toISOString().slice(2, 10).replaceAll('-', '');
    set('internalCode', `AMY-${typeCode}-${dateCode}-${Math.floor(100 + Math.random() * 900)}`);
  };

  const handleFiles = async (selectedFiles) => {
    const files = [...selectedFiles].filter(Boolean);
    if (!files.length) return;

    const existingFingerprints = new Set((form.images || []).map((image) => `${image.name}-${image.size}-${image.type}`));
    const uniqueFiles = files.filter((file) => !existingFingerprints.has(`${file.name}-${file.size}-${file.type}`));
    if (!uniqueFiles.length) {
      setError('Las fotografías seleccionadas ya fueron agregadas.');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');
    setUploadProgress(0);
    const uploaded = [];

    try {
      for (let index = 0; index < uniqueFiles.length; index += 1) {
        const image = await uploadPropertyImage(workingId, uniqueFiles[index], (fileProgress) => {
          const totalProgress = Math.round(((index + fileProgress / 100) / uniqueFiles.length) * 100);
          setUploadProgress(totalProgress);
        });
        uploaded.push(image);
      }

      setForm((current) => {
        const images = [...(current.images || []), ...uploaded];
        return { ...current, images, coverImage: current.coverImage || images[0]?.url || '' };
      });
      setDirty(true);
      setMessage(`${uploaded.length} fotografía${uploaded.length === 1 ? '' : 's'} subida${uploaded.length === 1 ? '' : 's'} correctamente.`);
    } catch (uploadError) {
      setError(uploadError?.message || 'No se pudieron subir las fotografías. Revisa las reglas de Firebase Storage.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const reorderImages = (from, to) => {
    if (from === to || from === null || to < 0 || to >= form.images.length) return;
    const next = [...form.images];
    const [selected] = next.splice(from, 1);
    next.splice(to, 0, selected);
    set('images', next);
  };

  const removeImage = async (image) => {
    if (!window.confirm('¿Eliminar definitivamente esta fotografía?')) return;
    setError('');
    try {
      await deleteStorageFile(image.path);
      setForm((current) => {
        const images = current.images.filter((item) => item.url !== image.url);
        return {
          ...current,
          images,
          coverImage: current.coverImage === image.url ? images[0]?.url || '' : current.coverImage,
        };
      });
      setDirty(true);
    } catch {
      setError('No se pudo eliminar la fotografía. Revisa los permisos de Firebase Storage.');
    }
  };

  const normalizePropertyDetails = () => Object.fromEntries(
    dynamicFields.map((definition) => {
      const value = form.propertyDetails?.[definition.key] ?? '';
      if (definition.type === 'number') return [definition.key, numericOrNull(value)];
      return [definition.key, typeof value === 'string' ? value.trim() : value];
    }).filter(([, value]) => value !== '' && value !== null && value !== undefined),
  );

  const scrollToWizard = () => {
    window.setTimeout(() => {
      document.querySelector('.property-workspace__wizard-intro')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 30);
  };

  const validateStep = (stepIndex) => {
    const key = visiblePropertySections[stepIndex][0];
    const errors = [];

    if (key === 'basic') {
      if (!form.title.trim()) errors.push('Escribe el título de la propiedad.');
      if (!form.propertyType) errors.push('Selecciona el tipo de propiedad.');
    }

    if (key === 'commercial') {
      if (!form.operationType) errors.push('Selecciona si la propiedad es para venta o alquiler.');
      if (!form.priceOnRequest && !(Number(form.price) > 0)) errors.push('Escribe un precio válido o activa “Precio a consultar”.');
    }

    if (key === 'location') {
      if (!form.department) errors.push('Selecciona el departamento o región.');
      if (!form.city.trim()) errors.push('Escribe la ciudad o municipio.');
    }

    if (errors.length) {
      setError(errors.join(' '));
      setMessage('');
      scrollToWizard();
      return false;
    }

    setError('');
    return true;
  };

  const goToStep = (stepIndex) => {
    if (stepIndex < 0 || stepIndex >= visiblePropertySections.length || stepIndex > furthestStep) return;
    setActiveStep(stepIndex);
    setError('');
    scrollToWizard();
  };

  const nextStep = () => {
    if (isFinalStep || !validateStep(activeStep)) return;
    const next = activeStep + 1;
    setFurthestStep((current) => Math.max(current, next));
    setActiveStep(next);
    setMessage('');
    scrollToWizard();
  };

  const previousStep = () => {
    if (activeStep <= 0) return;
    setActiveStep((current) => current - 1);
    setError('');
    setMessage('');
    scrollToWizard();
  };

  const validate = (publicationStatus) => {
    const errors = [];
    const addError = (step, text) => errors.push({ step, text });

    if (!form.title.trim()) addError(0, 'Escribe el título de la propiedad antes de guardar.');

    if (publicationStatus === 'published') {
      if (!form.propertyType) addError(0, 'Selecciona el tipo de propiedad.');
      if (!form.description.trim()) addError(0, 'Agrega una descripción antes de publicar.');
      if (!form.operationType) addError(1, 'Selecciona si es venta o alquiler.');
      if (!form.priceOnRequest && !(Number(form.price) > 0)) addError(1, 'Escribe un precio válido o activa “Precio a consultar”.');
      if (!form.department) addError(2, 'Selecciona el departamento antes de publicar.');
      if (!form.city.trim()) addError(2, 'Escribe la ciudad o municipio antes de publicar.');
      if (!form.coverImage) addError(4, 'Selecciona una fotografía de portada antes de publicar.');
    }

    if (errors.length) {
      const targetStep = errors[0].step;
      setFurthestStep((current) => Math.max(current, targetStep));
      setActiveStep(targetStep);
      setError(errors.map(({ text }) => text).join(' '));
      setMessage('');
      scrollToWizard();
      return false;
    }
    return true;
  };

  const submit = async (publicationStatus = form.publicationStatus) => {
    if (!validate(publicationStatus)) return;
    setSaving(true);
    setError('');
    setMessage('');

    const propertyDetails = normalizePropertyDetails();
    const payload = {
      ...form,
      ...propertyDetails,
      slug: form.slug.trim() || slugify(form.title),
      publicationStatus,
      published: publicationStatus === 'published',
      price: form.priceOnRequest ? 0 : Number(form.price || 0),
      rentPeriod: form.operationType === 'rent' ? form.rentPeriod : '',
      latitude: numericOrNull(form.latitude),
      longitude: numericOrNull(form.longitude),
      landArea: numericOrNull(form.landArea),
      constructionArea: numericOrNull(form.constructionArea),
      builtArea: numericOrNull(form.constructionArea),
      bedrooms: numericOrNull(form.bedrooms),
      bathrooms: numericOrNull(form.bathrooms),
      parkingSpaces: numericOrNull(form.parkingSpaces),
      yearBuilt: numericOrNull(form.yearBuilt),
      displayOrder: Number(form.displayOrder || 0),
      featured: Boolean(form.featured),
      priceNegotiable: Boolean(form.priceNegotiable),
      priceOnRequest: Boolean(form.priceOnRequest),
      features: asList(form.features),
      services: asList(form.services),
      amenities: [...new Set([...asList(form.amenities), ...asList(form.features), ...asList(form.services)])],
      highlightTags: asList(form.highlightTags).slice(0, 2),
      propertyDetails,
      images: (form.images || []).filter((image) => image?.url),
      coverImage: form.coverImage || form.images?.[0]?.url || '',
      address: form.publicAddress,
      videoUrl: cleanUrl(form.videoUrl),
      virtualTourUrl: cleanUrl(form.virtualTourUrl),
      seoTitle: form.seoTitle.trim(),
      seoDescription: form.seoDescription.trim(),
    };
    delete payload.id;

    try {
      await saveProperty(payload, workingId, user?.uid);
      setForm((current) => ({ ...current, ...payload }));
      setDirty(false);
      setMessage(publicationStatus === 'published'
        ? 'Propiedad publicada correctamente y disponible en la web.'
        : 'Propiedad guardada correctamente como borrador.');
      if (!id) navigate(`/admin/properties/${workingId}/edit`, { replace: true });
    } catch (saveError) {
      setError(saveError?.message || 'No se pudo guardar la propiedad. Revisa los permisos de Firestore.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="property-workspace__loading">Cargando propiedad...</p>;

  return (
    <div className="property-workspace property-workspace--wizard">
      <header className="property-workspace__header">
        <div>
          <p className="admin-eyebrow">Inventario inmobiliario</p>
          <h1>{id ? 'Editar propiedad' : 'Registrar nueva propiedad'}</h1>
          <p>Completa la ficha paso a paso. Puedes guardar como borrador en cualquier momento y continuar después.</p>
        </div>
        <Link className="btn secondary" to="/admin/properties">
          <ArrowLeft size={17} /> Volver al inventario
        </Link>
      </header>

      <div className="property-workspace__summary">
        <div className="property-workspace__completion">
          <div>
            <strong>{completion}%</strong>
            <span>Ficha completada</span>
          </div>
          <progress value={completion} max="100" />
        </div>

        <div className="property-workspace__wizard-summary" aria-label={`Paso ${activeStep + 1} de ${visiblePropertySections.length}`}>
          <div className="property-workspace__wizard-step-count">
            <strong>Paso {activeStep + 1} de {visiblePropertySections.length}</strong>
            <span>{activeSectionLabel}</span>
          </div>
          <div className="property-workspace__wizard-progress" aria-hidden="true">
            <span style={{ width: `${wizardProgress}%` }} />
          </div>
        </div>

        <div className="property-workspace__summary-state">
          <span className={`status-badge status-badge--${form.publicationStatus}`}>
            {publicationStatusOptions.find(([value]) => value === form.publicationStatus)?.[1] || 'Borrador'}
          </span>
          {dirty && <span className="property-workspace__unsaved">Cambios sin guardar</span>}
        </div>
      </div>

      <div className="property-workspace__layout">
        <aside className="property-workspace__navigation" aria-label="Pasos del registro de propiedad">
          <strong>Registro por etapas</strong>
          <p className="property-workspace__navigation-note">Avanza una sección a la vez para completar la ficha sin saturar el formulario.</p>
          {visiblePropertySections.map(([key, label], index) => {
            const complete = isStepComplete(form, key);
            const active = index === activeStep;
            const unlocked = index <= furthestStep;
            return (
              <button
                key={key}
                type="button"
                className={`${active ? 'is-active' : ''} ${complete ? 'is-complete' : ''}`.trim()}
                disabled={!unlocked}
                onClick={() => goToStep(index)}
                aria-current={active ? 'step' : undefined}
              >
                <span className="property-workspace__step-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="property-workspace__step-copy">
                  <strong>{label}</strong>
                  <small>{active ? 'Paso actual' : complete ? 'Completado' : unlocked ? 'Disponible' : 'Pendiente'}</small>
                </span>
                {complete && !active && <CheckCircle2 className="property-workspace__step-check" size={16} />}
              </button>
            );
          })}
        </aside>

        <form
          className="property-workspace__form"
          onSubmit={(event) => {
            event.preventDefault();
            if (isFinalStep) submit(form.publicationStatus);
            else nextStep();
          }}
        >
          <div className="property-workspace__wizard-intro">
            <div>
              <span className="property-workspace__wizard-intro-number">{String(activeStep + 1).padStart(2, '0')}</span>
              <div>
                <h2>{activeSectionLabel}</h2>
                <p>{stepDescriptions[activeSectionKey]}</p>
              </div>
            </div>
            <span>Paso {activeStep + 1} / {visiblePropertySections.length}</span>
          </div>

          <div className="property-workspace__messages" aria-live="polite">
            {message && <p className="success"><CheckCircle2 size={18} /> {message}</p>}
            {error && <p className="property-workspace__step-error"><AlertCircle size={18} /> {error}</p>}
          </div>

          {activeSectionKey === 'basic' && (
            <section id="property-basic" className="property-workspace__section">
              <div className="property-workspace__section-heading">
                <span>01</span>
                <div>
                  <h2>Información principal</h2>
                  <p>Datos con los que se identificará y presentará el inmueble.</p>
                </div>
              </div>
              <div className="property-workspace__grid">
                <Field
                  label="Título de la propiedad"
                  value={form.title}
                  onChange={(value) => set('title', value)}
                  placeholder="Ej. Casa moderna con piscina en Matagalpa"
                  required
                />
                <div className="property-workspace__inline-field">
                  <Field
                    label="Código interno"
                    value={form.internalCode}
                    onChange={(value) => set('internalCode', value)}
                    placeholder="AMY-CAS-001"
                  />
                  <button type="button" className="property-workspace__mini-button" onClick={generateInternalCode}>
                    <Sparkles size={16} /> Generar
                  </button>
                </div>
                <Field
                  label="Enlace amigable"
                  value={form.slug}
                  onChange={(value) => set('slug', slugify(value))}
                  placeholder={slugify(form.title) || 'casa-moderna-matagalpa'}
                  help="Se genera automáticamente a partir del título cuando se deja vacío."
                />
                <SelectField
                  label="Tipo de propiedad"
                  value={form.propertyType}
                  onChange={(value) => set('propertyType', value)}
                  options={propertyTypeOptions}
                  required
                />
                <TextAreaField
                  label="Descripción completa"
                  value={form.description}
                  onChange={(value) => set('description', value)}
                  placeholder="Describe distribución, acabados, ventajas, entorno, accesos y potencial de la propiedad. Los saltos de línea se conservarán."
                  rows={8}
                  required={form.publicationStatus === 'published'}
                />
                <TextAreaField
                  label="Resumen para tarjetas y redes"
                  value={form.shortDescription}
                  onChange={(value) => set('shortDescription', value.slice(0, 220))}
                  placeholder="Resumen breve y comercial de la propiedad."
                  rows={3}
                  help={`${form.shortDescription.length}/220 caracteres`}
                />
              </div>
            </section>
          )}

          {activeSectionKey === 'commercial' && (
            <section id="property-commercial" className="property-workspace__section">
              <div className="property-workspace__section-heading">
                <span>02</span>
                <div>
                  <h2>Precio y publicación</h2>
                  <p>Condiciones comerciales, disponibilidad y visibilidad pública.</p>
                </div>
              </div>
              <div className="property-workspace__grid">
                <SelectField label="Tipo de operación" value={form.operationType} onChange={(value) => set('operationType', value)} options={operationTypeOptions} required />
                <SelectField label="Moneda" value={form.currency} onChange={(value) => set('currency', value)} options={currencyOptions} />
                <Field
                  label="Precio"
                  value={form.price}
                  onChange={(value) => set('price', value)}
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  required={!form.priceOnRequest}
                  help={form.operationType === 'rent' ? 'Indica el canon según el período seleccionado.' : 'Precio de venta solicitado.'}
                />
                {form.operationType === 'rent' && (
                  <SelectField label="Período del alquiler" value={form.rentPeriod} onChange={(value) => set('rentPeriod', value)} options={rentPeriodOptions} />
                )}
                <SelectField label="Estado comercial" value={form.status} onChange={(value) => set('status', value)} options={propertyStatusOptions} />
                <SelectField
                  label="Estado de publicación"
                  value={form.publicationStatus}
                  onChange={(value) => set('publicationStatus', value)}
                  options={publicationStatusOptions}
                  help="Borrador no aparece en la web; Publicada sí; Archivada permanece solo en el panel."
                />
                <Field label="Orden de aparición" value={form.displayOrder} onChange={(value) => set('displayOrder', value)} type="number" min="0" placeholder="0" help="Los números menores aparecen primero." />
                <div className="property-workspace__checks property-workspace__field--full">
                  <label>
                    <input type="checkbox" checked={form.priceNegotiable} onChange={(event) => set('priceNegotiable', event.target.checked)} />
                    <span><strong>Precio negociable</strong><small>Se mostrará como una condición comercial de la propiedad.</small></span>
                  </label>
                  <label>
                    <input type="checkbox" checked={form.priceOnRequest} onChange={(event) => set('priceOnRequest', event.target.checked)} />
                    <span><strong>Precio a consultar</strong><small>Oculta el valor numérico en la presentación pública.</small></span>
                  </label>
                  <label>
                    <input type="checkbox" checked={form.featured} onChange={(event) => set('featured', event.target.checked)} />
                    <span><strong>Destacar en inicio</strong><small>Permite mostrarla en el bloque de propiedades destacadas.</small></span>
                  </label>
                </div>
              </div>
            </section>
          )}

          {activeSectionKey === 'location' && (
            <section id="property-location" className="property-workspace__section">
              <div className="property-workspace__section-heading">
                <span>03</span>
                <div>
                  <h2>Ubicación y mapa</h2>
                  <p>Selecciona la zona y coloca el marcador con precisión.</p>
                </div>
              </div>
              <div className="property-workspace__grid">
                <SelectField
                  label="Departamento o región"
                  value={form.department}
                  onChange={(value) => set('department', value)}
                  options={[['', 'Seleccionar departamento'], ...nicaraguaDepartments.map((item) => [item, item])]}
                  required
                />
                <Field label="Ciudad o municipio" value={form.city} onChange={(value) => set('city', value)} placeholder="Ej. Matagalpa" required />
                <Field label="Barrio, sector o residencial" value={form.sector} onChange={(value) => set('sector', value)} placeholder="Ej. Molino Norte" />
                <Field label="Dirección pública" value={form.publicAddress} onChange={(value) => set('publicAddress', value)} placeholder="Referencia que sí puede mostrarse al visitante" />
                <Field label="Referencia interna" value={form.privateAddress} onChange={(value) => set('privateAddress', value)} placeholder="Referencia de trabajo para la administradora" help="No se muestra en las plantillas públicas de la web." />
                <Field label="Latitud" value={form.latitude} onChange={(value) => set('latitude', value)} type="number" step="any" placeholder="12.9256000" />
                <Field label="Longitud" value={form.longitude} onChange={(value) => set('longitude', value)} type="number" step="any" placeholder="-85.9175000" />
                <div className="property-workspace__field--full">
                  <PropertyMapPicker
                    latitude={form.latitude}
                    longitude={form.longitude}
                    onChange={(latitude, longitude) => {
                      setForm((current) => ({ ...current, latitude, longitude }));
                      setDirty(true);
                    }}
                    onAddressSelect={(label) => {
                      setForm((current) => ({
                        ...current,
                        mapSearchLabel: label,
                        publicAddress: current.publicAddress || label,
                      }));
                      setDirty(true);
                    }}
                  />
                </div>
              </div>
            </section>
          )}

          {activeSectionKey === 'details' && (
            <section id="property-details" className="property-workspace__section">
              <div className="property-workspace__section-heading">
                <span>04</span>
                <div>
                  <h2>Medidas y características</h2>
                  <p>El formulario se adapta automáticamente al tipo de propiedad seleccionado.</p>
                </div>
              </div>
              <div className="property-workspace__grid">
                <Field label="Área del terreno" value={form.landArea} onChange={(value) => set('landArea', value)} type="number" min="0" step="any" placeholder="0" />
                <Field label="Área de construcción" value={form.constructionArea} onChange={(value) => set('constructionArea', value)} type="number" min="0" step="any" placeholder="0" />
                <SelectField label="Unidad de área" value={form.areaUnit} onChange={(value) => set('areaUnit', value)} options={areaUnitOptions} />
                <Field label="Habitaciones" value={form.bedrooms} onChange={(value) => set('bedrooms', value)} type="number" min="0" step="1" placeholder="0" />
                <Field label="Baños" value={form.bathrooms} onChange={(value) => set('bathrooms', value)} type="number" min="0" step="0.5" placeholder="0" />
                <Field label="Estacionamientos" value={form.parkingSpaces} onChange={(value) => set('parkingSpaces', value)} type="number" min="0" step="1" placeholder="0" />
                <Field label="Año de construcción" value={form.yearBuilt} onChange={(value) => set('yearBuilt', value)} type="number" min="1800" step="1" placeholder="2026" />
              </div>

              <div className="property-workspace__dynamic">
                <div className="property-workspace__subheading">
                  <Sparkles size={18} />
                  <div>
                    <h3>Datos específicos del inmueble</h3>
                    <p>Campos configurados para el tipo de propiedad seleccionado.</p>
                  </div>
                </div>
                <div className="property-workspace__grid">
                  {dynamicFields.map((definition) => (
                    <DynamicField
                      key={definition.key}
                      definition={definition}
                      value={form.propertyDetails?.[definition.key] ?? ''}
                      onChange={(value) => setDetail(definition.key, value)}
                    />
                  ))}
                </div>
              </div>

              <ChoiceGrid title="Características" items={featurePresets} selected={form.features} onToggle={(value) => toggleListValue('features', value)} help="Selecciona todas las que correspondan." />
              <div className="property-workspace__custom-entry">
                <input value={customFeature} onChange={(event) => setCustomFeature(event.target.value)} placeholder="Agregar otra característica" onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addCustomValue('features', customFeature, setCustomFeature); } }} />
                <button type="button" onClick={() => addCustomValue('features', customFeature, setCustomFeature)}><Plus size={17} /> Agregar</button>
              </div>
              <div className="property-workspace__selected-list">
                {form.features.filter((item) => !featurePresets.includes(item)).map((item) => (
                  <span key={item}>{item}<button type="button" aria-label={`Quitar ${item}`} onClick={() => removeListValue('features', item)}><X size={14} /></button></span>
                ))}
              </div>

              <ChoiceGrid title="Servicios disponibles" items={servicePresets} selected={form.services} onToggle={(value) => toggleListValue('services', value)} help="Servicios e infraestructura disponibles en la propiedad o zona." />
              <div className="property-workspace__custom-entry">
                <input value={customService} onChange={(event) => setCustomService(event.target.value)} placeholder="Agregar otro servicio" onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addCustomValue('services', customService, setCustomService); } }} />
                <button type="button" onClick={() => addCustomValue('services', customService, setCustomService)}><Plus size={17} /> Agregar</button>
              </div>
              <div className="property-workspace__selected-list">
                {form.services.filter((item) => !servicePresets.includes(item)).map((item) => (
                  <span key={item}>{item}<button type="button" aria-label={`Quitar ${item}`} onClick={() => removeListValue('services', item)}><X size={14} /></button></span>
                ))}
              </div>
            </section>
          )}

          {activeSectionKey === 'media' && (
            <section id="property-media" className="property-workspace__section">
              <div className="property-workspace__section-heading">
                <span>05</span>
                <div>
                  <h2>Fotografías y multimedia</h2>
                  <p>Sube, ordena y selecciona la portada sin utilizar enlaces externos.</p>
                </div>
              </div>

              <label className={`property-workspace__dropzone ${uploading ? 'is-uploading' : ''}`}>
                <ImagePlus size={34} />
                <strong>{uploading ? 'Subiendo fotografías...' : 'Seleccionar fotografías'}</strong>
                <span>JPG, PNG o WEBP · máximo 8 MB por imagen · selección múltiple</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  disabled={uploading}
                  onChange={(event) => {
                    handleFiles(event.target.files);
                    event.target.value = '';
                  }}
                />
              </label>

              {uploading && (
                <div className="property-workspace__upload-progress">
                  <div><span>Progreso total</span><strong>{uploadProgress}%</strong></div>
                  <progress value={uploadProgress} max="100" />
                </div>
              )}

              <div className="property-workspace__image-grid">
                {form.images.map((image, index) => (
                  <article
                    key={`${image.url}-${index}`}
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => { reorderImages(dragIndex, index); setDragIndex(null); }}
                    className={form.coverImage === image.url ? 'is-cover' : ''}
                  >
                    <div className="property-workspace__image-preview">
                      <img src={image.url} alt={`Fotografía ${index + 1}`} />
                      <span className="property-workspace__image-position">{index + 1}</span>
                      {form.coverImage === image.url && <span className="property-workspace__cover-badge"><Star size={14} /> Portada</span>}
                    </div>
                    <div className="property-workspace__image-meta">
                      <GripVertical size={18} aria-hidden="true" />
                      <span title={image.name}>{image.name || `Fotografía ${index + 1}`}</span>
                    </div>
                    <div className="property-workspace__image-actions">
                      <button type="button" onClick={() => set('coverImage', image.url)} disabled={form.coverImage === image.url}><Star size={15} /> Portada</button>
                      <button type="button" onClick={() => reorderImages(index, index - 1)} disabled={index === 0}>←</button>
                      <button type="button" onClick={() => reorderImages(index, index + 1)} disabled={index === form.images.length - 1}>→</button>
                      <button type="button" className="danger-action" onClick={() => removeImage(image)}><Trash2 size={15} /> Eliminar</button>
                    </div>
                  </article>
                ))}
              </div>
              {!form.images.length && <p className="empty">Todavía no se han agregado fotografías de la propiedad.</p>}

              <div className="property-workspace__grid property-workspace__media-links">
                <Field label="Video de la propiedad" value={form.videoUrl} onChange={(value) => set('videoUrl', value)} type="url" placeholder="https://youtube.com/..." />
                <Field label="Recorrido virtual" value={form.virtualTourUrl} onChange={(value) => set('virtualTourUrl', value)} type="url" placeholder="https://..." />
              </div>
            </section>
          )}

          <div className="property-workspace__sticky-actions">
            <div className="property-workspace__sticky-step">
              <strong>{form.title || activeSectionLabel}</strong>
              <span>{dirty ? `Paso ${activeStep + 1}: cambios pendientes` : `Paso ${activeStep + 1}: cambios guardados`}</span>
            </div>
            <div className="property-workspace__wizard-actions">
              {(id || !dirty) && form.publicationStatus === 'published' && (
                <Link className="btn secondary" to={`/properties/${publicSlug}`} target="_blank">
                  <Eye size={17} /> Vista pública
                </Link>
              )}
              {activeStep > 0 && (
                <button className="btn secondary" type="button" disabled={saving || uploading} onClick={previousStep}>
                  <ChevronLeft size={17} /> Anterior
                </button>
              )}
              <button className="btn secondary" type="button" disabled={saving || uploading} onClick={() => submit('draft')}>
                <Save size={17} /> {saving ? 'Guardando...' : 'Guardar borrador'}
              </button>
              {!isFinalStep ? (
                <button className="btn property-workspace__next" type="button" disabled={saving || uploading} onClick={nextStep}>
                  Siguiente <ChevronRight size={17} />
                </button>
              ) : (
                <button className="btn primary property-workspace__publish" type="button" disabled={saving || uploading} onClick={() => submit('published')}>
                  <Send size={17} /> {saving ? 'Publicando...' : 'Guardar y publicar'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
