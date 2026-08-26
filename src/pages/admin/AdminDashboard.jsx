import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  CircleDollarSign,
  FilePenLine,
  House,
  MessageSquareText,
  Sparkles,
} from 'lucide-react';
import { getProperties } from '../../services/propertyService';
import { getInquiries } from '../../services/inquiryService';
import './AdminDashboard.css';

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === 'function') return value.toMillis();
  if (typeof value?.toDate === 'function') return value.toDate().getTime();
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatDate = (value) => {
  if (!value) return 'Sin fecha';
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return date.toLocaleDateString('es-NI', { day: '2-digit', month: 'short' });
};

export default function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([getProperties({ admin: true }), getInquiries()])
      .then(([propertyItems, inquiryItems]) => {
        if (!active) return;
        setProperties(propertyItems);
        setInquiries(inquiryItems);
      })
      .catch(() => {
        if (active) setError('No se pudieron cargar todos los datos del panel en este momento.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => [
    {
      label: 'Total de propiedades',
      value: properties.length,
      icon: Building2,
      tone: 'navy',
    },
    {
      label: 'Publicadas',
      value: properties.filter((item) => item.publicationStatus === 'published').length,
      icon: Sparkles,
      tone: 'gold',
    },
    {
      label: 'En borrador',
      value: properties.filter((item) => item.publicationStatus === 'draft').length,
      icon: FilePenLine,
      tone: 'slate',
    },
    {
      label: 'Vendidas',
      value: properties.filter((item) => item.status === 'sold').length,
      icon: CircleDollarSign,
      tone: 'green',
    },
    {
      label: 'Alquiladas',
      value: properties.filter((item) => item.status === 'rented').length,
      icon: House,
      tone: 'blue',
    },
    {
      label: 'Consultas pendientes',
      value: inquiries.filter((item) => item.status === 'new').length,
      icon: MessageSquareText,
      tone: 'rose',
    },
  ], [properties, inquiries]);

  const recentItems = useMemo(() => {
    const propertyActivity = properties.map((item) => ({
      id: `property-${item.id}`,
      title: item.title || 'Propiedad sin título',
      kind: 'Propiedad',
      date: item.updatedAt || item.createdAt,
    }));

    const inquiryActivity = inquiries.map((item) => ({
      id: `inquiry-${item.id}`,
      title: item.name || item.email || 'Nueva consulta',
      kind: 'Consulta',
      date: item.updatedAt || item.createdAt,
    }));

    return [...propertyActivity, ...inquiryActivity]
      .sort((a, b) => toMillis(b.date) - toMillis(a.date))
      .slice(0, 6);
  }, [properties, inquiries]);

  return (
    <div className="admin-dashboard-premium">
      <header className="admin-dashboard-premium__heading">
        <div>
          <p className="admin-eyebrow">Resumen general</p>
          <h1>Panel principal</h1>
          <p className="admin-dashboard-premium__lead">
            Una vista rápida del inventario y la actividad comercial de la web.
          </p>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="admin-dashboard-premium__stats" aria-label="Estadísticas principales">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <article className={`admin-dashboard-stat admin-dashboard-stat--${tone}`} key={label}>
            <span className="admin-dashboard-stat__icon" aria-hidden="true">
              <Icon size={19} strokeWidth={1.8} />
            </span>
            <div className="admin-dashboard-stat__value">{loading ? '—' : value}</div>
            <div className="admin-dashboard-stat__label">{label}</div>
          </article>
        ))}
      </section>

      <section className="admin-dashboard-activity">
        <div className="admin-dashboard-activity__heading">
          <div>
            <p className="admin-eyebrow">Últimos movimientos</p>
            <h2>Actividad reciente</h2>
          </div>
          <span>{recentItems.length} registros</span>
        </div>

        {loading ? (
          <div className="admin-dashboard-activity__empty">Cargando actividad…</div>
        ) : recentItems.length ? (
          <div className="admin-dashboard-activity__list">
            {recentItems.map((item) => (
              <article className="admin-dashboard-activity__item" key={item.id}>
                <span className="admin-dashboard-activity__marker" aria-hidden="true" />
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.kind}</small>
                </div>
                <time>{formatDate(item.date)}</time>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-dashboard-activity__empty">Todavía no hay actividad reciente.</div>
        )}
      </section>
    </div>
  );
}
