import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Award, Maximize2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import { useSiteImages } from '../../contexts/SiteImagesContext';

const slots = [
  { key: 'recognition1', number: '01' },
  { key: 'recognition2', number: '02' },
  { key: 'recognition3', number: '03' },
  { key: 'recognition4', number: '04' },
  { key: 'recognition5', number: '05' },
  { key: 'recognition6', number: '06' },
];

export default function Recognitions() {
  const { images } = useSiteImages();
  const [selected, setSelected] = useState(null);

  const items = useMemo(
    () => slots
      .map((slot) => ({ ...slot, src: String(images[slot.key] || '').trim() }))
      .filter((item) => item.src),
    [images],
  );

  useEffect(() => {
    if (!selected) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selected]);

  return (
    <div className="amy-recognitions-page">
      <SEO
        title="Reconocimientos | Amy Blandón"
        description="Conoce los diplomas, certificaciones, premios y reconocimientos que respaldan la trayectoria profesional de Amy Blandón."
      />

      <section className="amy-recognitions-hero">
        <div className="amy-recognitions-hero__glow" aria-hidden="true" />
        <div className="amy-recognitions-shell">
          <Link className="amy-recognitions-back" to="/sobre-mi">
            <ArrowLeft size={17} aria-hidden="true" />
            Volver a Sobre mí
          </Link>
          <div className="amy-recognitions-hero__content">
            <p className="amy-recognitions-kicker"><Award size={17} aria-hidden="true" /> TRAYECTORIA PROFESIONAL</p>
            <h1>Reconocimientos que respaldan mi trayectoria.</h1>
            <p className="amy-recognitions-hero__lead">
              Una selección de diplomas, certificaciones y reconocimientos que representan años de preparación,
              compromiso y crecimiento profesional.
            </p>
          </div>
        </div>
      </section>

      <main className="amy-recognitions-main">
        <div className="amy-recognitions-shell">
          <div className="amy-recognitions-heading">
            <div>
              <p className="amy-recognitions-kicker">DIPLOMAS Y RECONOCIMIENTOS</p>
              <h2>Experiencia que también se demuestra.</h2>
            </div>
            <p>Conoce parte de la formación y los reconocimientos que acompañan mi trabajo en seguros, bienes raíces e inversiones.</p>
          </div>

          {items.length ? (
            <div className="amy-recognitions-grid">
              {items.map((item) => (
                <button
                  className="amy-recognition-card"
                  type="button"
                  key={item.key}
                  onClick={() => setSelected(item)}
                  aria-label={`Ampliar reconocimiento ${item.number}`}
                >
                  <span className="amy-recognition-card__image">
                    <img src={item.src} alt={`Reconocimiento profesional ${item.number}`} loading="lazy" decoding="async" />
                  </span>
                  <span className="amy-recognition-card__footer">
                    <span>RECONOCIMIENTO {item.number}</span>
                    <Maximize2 size={16} aria-hidden="true" />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <section className="amy-recognitions-empty">
              <span className="amy-recognitions-empty__icon"><Award size={30} aria-hidden="true" /></span>
              <p className="amy-recognitions-kicker">PRÓXIMAMENTE</p>
              <h3>Mi trayectoria también cuenta su historia.</h3>
              <p>Los diplomas y reconocimientos profesionales de Amy aparecerán aquí a medida que sean incorporados desde el panel de administración.</p>
            </section>
          )}
        </div>
      </main>

      {selected && (
        <div className="amy-recognition-lightbox" role="dialog" aria-modal="true" aria-label="Reconocimiento ampliado" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <button className="amy-recognition-lightbox__close" type="button" onClick={() => setSelected(null)} aria-label="Cerrar">
            <X size={23} aria-hidden="true" />
          </button>
          <img src={selected.src} alt={`Reconocimiento profesional ${selected.number} ampliado`} />
        </div>
      )}
    </div>
  );
}
