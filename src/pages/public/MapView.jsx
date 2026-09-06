import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/property-map-catalog.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import PropertyCard from '../../components/properties/PropertyCard';
import { subscribeProperties } from '../../services/propertyService';
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

const propertyPrice = (property) => (
  property?.priceOnRequest
    ? 'Consultar'
    : money(property?.price, property?.currency)
);

const priceMarkerIcon = (property) => L.divIcon({
  className: 'property-price-marker',
  html: propertyPrice(property),
  iconSize: [96, 34],
  iconAnchor: [48, 24],
  popupAnchor: [0, -26],
});

function Fit({ items, embedded }) {
  const map = useMap();

  useEffect(() => {
    if (!items.length) return undefined;

    const applyViewport = () => {
      map.invalidateSize({ pan: false });

      if (items.length === 1) {
        const [property] = items;
        map.setView(
          [property.latitude, property.longitude],
          embedded ? 14 : 13,
          { animate: false },
        );
        return;
      }

      map.fitBounds(items.map((property) => [property.latitude, property.longitude]), {
        padding: embedded ? [44, 44] : [54, 54],
        maxZoom: embedded ? 14 : 13,
        animate: false,
      });
    };

    const frame = requestAnimationFrame(applyViewport);
    const timeout = window.setTimeout(applyViewport, 180);
    const container = map.getContainer();
    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => requestAnimationFrame(applyViewport))
      : null;

    resizeObserver?.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      resizeObserver?.disconnect();
    };
  }, [embedded, items, map]);

  return null;
}

export default function MapView({ embedded = false, properties }) {
  const [items, setItems] = useState(Array.isArray(properties) ? properties : []);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (Array.isArray(properties)) {
      setItems(properties);
      setLoadError('');
      return undefined;
    }

    let active = true;
    const unsubscribe = subscribeProperties(
      {},
      (result) => {
        if (!active) return;
        setItems(Array.isArray(result) ? result : []);
        setLoadError('');
      },
      () => {
        if (!active) return;
        setItems([]);
        setLoadError('No se pudieron cargar las ubicaciones en este momento.');
      },
    );

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [properties]);

  const safeItems = Array.isArray(items) ? items : [];
  const mappedItems = useMemo(
    () => safeItems.map(mapPoint).filter(Boolean),
    [safeItems],
  );

  const initialCenter = useMemo(() => {
    if (!mappedItems.length) return [12.8654, -85.2072];
    const totals = mappedItems.reduce(
      (accumulator, property) => ({
        latitude: accumulator.latitude + property.latitude,
        longitude: accumulator.longitude + property.longitude,
      }),
      { latitude: 0, longitude: 0 },
    );
    return [
      totals.latitude / mappedItems.length,
      totals.longitude / mappedItems.length,
    ];
  }, [mappedItems]);

  return (
    <section className={embedded ? 'mapWrap embedded mapWrap--embedded' : 'mapWrap'}>
      {!embedded && (
        <div className="filters">
          <input placeholder="Buscar ubicación" aria-label="Buscar ubicación" />
        </div>
      )}

      {mappedItems.length ? (
        <MapContainer
          center={initialCenter}
          zoom={mappedItems.length === 1 ? 14 : 10}
          scrollWheelZoom
          style={embedded ? { width: '100%', height: '100%' } : undefined}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Fit items={mappedItems} embedded={embedded} />
          {mappedItems.map((property) => (
            <Marker
              key={property.id || property.slug}
              position={[property.latitude, property.longitude]}
              icon={embedded ? priceMarkerIcon(property) : undefined}
              riseOnHover
            >
              <Popup>
                <div className="map-property-popup">
                  <strong>{propertyPrice(property)}</strong>
                  <span>{property.title}</span>
                  <Link to={`/properties/${property.slug || property.id}`}>Ver propiedad</Link>
                </div>
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
