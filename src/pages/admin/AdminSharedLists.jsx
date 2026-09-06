import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, ExternalLink, Link2, Search, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getProperties } from '../../services/propertyService';
import {
  createSharedList,
  deleteSharedList,
  listSharedLists,
  sharedListUrl,
} from '../../services/sharedListService';
import { money } from '../../utils/format';
import '../../styles/shared-lists.css';

const imageUrl = (image) => (typeof image === 'string' ? image : image?.url || '');

const propertyImage = (property) => (
  imageUrl(property?.coverImage)
  || imageUrl(Array.isArray(property?.images) ? property.images[0] : property?.images)
);

const locationLabel = (property) => [
  property?.sector,
  property?.city,
  property?.department || property?.state,
].filter(Boolean).join(', ');

const formatDate = (value) => {
  const date = value?.toDate?.() || (value ? new Date(value) : null);
  if (!date || Number.isNaN(date.getTime())) return 'Recién creada';
  return new Intl.DateTimeFormat('es-NI', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const copyText = async (value) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const area = document.createElement('textarea');
  area.value = value;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
};

export default function AdminSharedLists() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [listName, setListName] = useState('');
  const [clientName, setClientName] = useState('');
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [copiedToken, setCopiedToken] = useState('');

  const reloadLists = async () => {
    const result = await listSharedLists();
    setLists(result);
  };

  useEffect(() => {
    let active = true;

    Promise.all([getProperties({ admin: true }), listSharedLists()])
      .then(([propertyItems, listItems]) => {
        if (!active) return;
        setProperties((propertyItems || []).filter((item) => item.publicationStatus === 'published'));
        setLists(listItems || []);
      })
      .catch(() => {
        if (active) setError('No se pudieron cargar las propiedades o las listas compartidas.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return properties;

    return properties.filter((property) => [
      property.title,
      property.sector,
      property.city,
      property.department,
      property.state,
      property.publicAddress,
      property.propertyType,
    ].filter(Boolean).join(' ').toLowerCase().includes(term));
  }, [properties, search]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const toggleProperty = (id) => {
    setSelected((current) => (
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    ));
  };

  const createList = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!listName.trim()) {
      setError('Escribe un nombre para la lista.');
      return;
    }
    if (!clientName.trim()) {
      setError('Escribe el nombre del cliente.');
      return;
    }
    if (!selected.length) {
      setError('Selecciona al menos una propiedad para compartir.');
      return;
    }

    setSaving(true);
    try {
      const created = await createSharedList({
        listName,
        clientName,
        propertyIds: selected,
      }, user?.uid || '');

      const url = sharedListUrl(created.token);
      await copyText(url).catch(() => null);
      setCopiedToken(created.token);
      setMessage('Lista creada. El enlace quedó listo para compartir y se intentó copiar automáticamente.');
      setListName('');
      setClientName('');
      setSelected([]);
      await reloadLists();
    } catch {
      setError('No se pudo crear la lista compartida. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const copyList = async (token) => {
    setError('');
    try {
      await copyText(sharedListUrl(token));
      setCopiedToken(token);
      window.setTimeout(() => setCopiedToken((current) => (current === token ? '' : current)), 2200);
    } catch {
      setError('No se pudo copiar el enlace. Puedes abrirlo y copiarlo desde el navegador.');
    }
  };

  const removeList = async (item) => {
    const confirmed = window.confirm(`¿Eliminar la lista “${item.listName || 'Sin nombre'}”? El enlace dejará de funcionar.`);
    if (!confirmed) return;

    setError('');
    try {
      await deleteSharedList(item.token);
      setLists((current) => current.filter((list) => list.token !== item.token));
    } catch {
      setError('No se pudo eliminar la lista compartida.');
    }
  };

  return (
    <section className="shared-lists-admin">
      <header className="shared-lists-admin__heading">
        <div>
          <p className="shared-lists-kicker">CLIENTES · BIENES RAÍCES</p>
          <h1>Listas compartidas</h1>
          <p>Crea una selección privada con las propiedades que quieras recomendar a cada cliente y comparte un solo enlace.</p>
        </div>
        <div className="shared-lists-admin__metric">
          <strong>{selected.length}</strong>
          <span>seleccionadas</span>
        </div>
      </header>

      {error && <p className="shared-lists-admin__alert shared-lists-admin__alert--error">{error}</p>}
      {message && <p className="shared-lists-admin__alert shared-lists-admin__alert--success">{message}</p>}

      <form className="shared-list-builder" onSubmit={createList}>
        <div className="shared-list-builder__meta">
          <label>
            <span>Nombre de la lista</span>
            <input
              value={listName}
              onChange={(event) => setListName(event.target.value)}
              placeholder="Ej. Opciones de inversión en Matagalpa"
              maxLength={100}
            />
          </label>
          <label>
            <span>Cliente</span>
            <input
              value={clientName}
              onChange={(event) => setClientName(event.target.value)}
              placeholder="Nombre del cliente"
              maxLength={100}
            />
          </label>
        </div>

        <div className="shared-list-builder__toolbar">
          <label className="shared-list-search">
            <Search aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, ciudad, zona o tipo de propiedad"
              aria-label="Buscar propiedades para agregar a la lista"
            />
          </label>
          <span>{filtered.length} propiedades publicadas</span>
        </div>

        <div className="shared-list-property-picker">
          {loading ? (
            <div className="shared-list-empty">Cargando propiedades...</div>
          ) : filtered.length === 0 ? (
            <div className="shared-list-empty">No hay propiedades que coincidan con la búsqueda.</div>
          ) : filtered.map((property) => {
            const active = selectedSet.has(property.id);
            const image = propertyImage(property);
            return (
              <button
                type="button"
                key={property.id}
                className={`shared-list-property-option ${active ? 'is-selected' : ''}`}
                onClick={() => toggleProperty(property.id)}
                aria-pressed={active}
              >
                <span className="shared-list-property-option__image">
                  {image ? <img src={image} alt="" /> : <span>Sin foto</span>}
                </span>
                <span className="shared-list-property-option__copy">
                  <strong>{property.title || 'Propiedad sin título'}</strong>
                  <small>{locationLabel(property) || 'Nicaragua'}</small>
                  <b>{property.priceOnRequest ? 'Precio a consultar' : money(property.price, property.currency)}</b>
                </span>
                <span className="shared-list-property-option__check" aria-hidden="true">
                  {active ? <Check /> : null}
                </span>
              </button>
            );
          })}
        </div>

        <div className="shared-list-builder__footer">
          <span>{selected.length ? `${selected.length} propiedad${selected.length === 1 ? '' : 'es'} en esta lista` : 'Selecciona las propiedades que quieres compartir'}</span>
          <button className="shared-list-create-button" type="submit" disabled={saving}>
            <Link2 /> {saving ? 'Generando enlace...' : 'Generar lista y enlace'}
          </button>
        </div>
      </form>

      <section className="shared-list-history">
        <div className="shared-list-history__heading">
          <div>
            <p className="shared-lists-kicker">HISTORIAL</p>
            <h2>Listas generadas</h2>
          </div>
          <span>{lists.length}</span>
        </div>

        {lists.length === 0 ? (
          <div className="shared-list-empty">Todavía no hay listas compartidas.</div>
        ) : (
          <div className="shared-list-history__grid">
            {lists.map((item) => {
              const url = sharedListUrl(item.token);
              return (
                <article key={item.token} className="shared-list-history-card">
                  <div>
                    <span className="shared-list-history-card__client">{item.clientName || 'Cliente'}</span>
                    <h3>{item.listName || 'Selección inmobiliaria'}</h3>
                    <p>{item.propertyIds?.length || 0} propiedades · {formatDate(item.createdAt)}</p>
                  </div>
                  <div className="shared-list-history-card__url">{url}</div>
                  <div className="shared-list-history-card__actions">
                    <button type="button" onClick={() => copyList(item.token)}>
                      {copiedToken === item.token ? <Check /> : <Copy />}
                      {copiedToken === item.token ? 'Copiado' : 'Copiar enlace'}
                    </button>
                    <a href={url} target="_blank" rel="noreferrer"><ExternalLink /> Abrir</a>
                    <button type="button" className="is-danger" onClick={() => removeList(item)}><Trash2 /> Eliminar</button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}
