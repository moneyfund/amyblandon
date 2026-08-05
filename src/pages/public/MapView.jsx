import { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import PropertyCard from '../../components/properties/PropertyCard';
import { getProperties } from '../../services/propertyService';
import { money } from '../../utils/format';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const coordinate = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const mapPoint = (property) => {
  const latitude = coordinate(property?.latitude);
  const longitude = coordinate(property?.longitude);
  const validRange = latitude !== null
    && longitude !== null
    && latitude >= -90
    && latitude <= 90
    && longitude >= -180
    && longitude <= 180;

  if (!validRange || (latitude === 0 && longitude === 0)) return null;
  return { ...property, latitude, longitude };
};

function Fit({ items }) {
  const map = useMap();

  useEffect(() => {
    if (!items.length) return;
    map.fitBounds(items.map((property) => [property.latitude, property.longitude]), {
      padding: [40, 40],
      maxZoom: 15,
    });
  }, [items, map]);

  return null;
}

export default function MapView({ embedded = false, properties }) {
  const [items, setItems] = useState(Array.isArray(properties) ? properties : []);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (Array.isArray(properties)) {
      setItems(properties);
      setLoadError('');
      return;
    }

    let active = true;
    getProperties()
      .then((result) => {
        if (active) setItems(Array.isArray(result) ? result : []);
      })
      .catch(() => {
        if (active) {
          setItems([]);
          setLoadError('No se pudieron cargar las ubicaciones en este momento.');
        }
      });

    return () => {
      active = false;
    };
  }, [properties]);

  const safeItems = Array.isArray(items) ? items : [];
  const mappedItems = useMemo(
    () => safeItems.map(mapPoint).filter(Boolean),
    [safeItems],
  );

  return (
    <section className={embedded ? 'mapWrap embedded' : 'mapWrap'}>
      <div className="filters">
        <input placeholder="Buscar ubicación" aria-label="Buscar ubicación" />
      </div>

      {mappedItems.length ? (
        <MapContainer center={[12.8654, -85.2072]} zoom={7} scrollWheelZoom={false}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Fit items={mappedItems} />
          {mappedItems.map((property) => (
            <Marker
              key={property.id || property.slug}
              position={[property.latitude, property.longitude]}
            >
              <Popup>
                {money(property.price, property.currency)}
                <br />
                {property.title}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <div className="panel map-empty" role="status">
          <strong>Ubicación pendiente</strong>
          <p>
            {loadError || 'Estas propiedades todavía no tienen coordenadas válidas para mostrarse en el mapa.'}
          </p>
        </div>
      )}

      {!embedded && (
        <div className="mapCards">
          {safeItems.map((property) => (
            <PropertyCard key={property.id || property.slug} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}
