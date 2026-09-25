import { amyContact } from '../content/homePage.es';
import { getDynamicFields } from '../config/propertyWorkspace.es';
import {
  labelFor,
  operationTypeOptions,
  propertyStatusOptions,
  propertyTypeOptions,
} from '../config/adminLabels.es';

const PAGE = { width: 1240, height: 1754 };
const COLORS = {
  navy: '#001929',
  navySoft: '#073247',
  gold: '#C99A44',
  goldLight: '#E2BE73',
  ivory: '#F8F6F1',
  white: '#FFFFFF',
  text: '#102E3B',
  muted: '#61747D',
  border: '#D9E0E0',
};

const cleanText = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const normalizeOperation = (value) => {
  if (value === 'venta') return 'sale';
  if (value === 'renta') return 'rent';
  return value || 'sale';
};
const asList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean);
  return value ? [String(value)] : [];
};
const imageUrl = (image) => (typeof image === 'string' ? image : image?.url || '');

const formatMoney = (value, currency = 'USD') => {
  if (!Number(value)) return 'Precio a consultar';
  try {
    return new Intl.NumberFormat('es-NI', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(Number(value));
  } catch {
    return `$${Number(value).toLocaleString('en-US')}`;
  }
};

const safeFileName = (value) => cleanText(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '') || 'propiedad';

function roundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function fillRoundedRect(ctx, x, y, width, height, radius, fill) {
  roundedRectPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
}

function strokeRoundedRect(ctx, x, y, width, height, radius, stroke, lineWidth = 1) {
  roundedRectPath(ctx, x, y, width, height, radius);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function wrapLines(ctx, text, maxWidth, maxLines = Infinity) {
  const words = cleanText(text).split(' ').filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let line = '';

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth || !line) {
      line = test;
      continue;
    }
    lines.push(line);
    line = word;
    if (lines.length === maxLines) break;
  }

  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines) {
    const consumed = lines.join(' ').split(' ').length;
    if (consumed < words.length) {
      let last = lines[lines.length - 1];
      while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
      lines[lines.length - 1] = `${last.replace(/[.,;:!?-]+$/g, '')}…`;
    }
  }
  return lines;
}

function wrapDescriptionLines(ctx, value, maxWidth, maxLines = Infinity) {
  const paragraphs = String(value || '')
    .replace(/\r\n?/g, '\n')
    .split('\n');

  const lines = [];
  for (const rawParagraph of paragraphs) {
    if (lines.length >= maxLines) break;

    const paragraph = rawParagraph.trim();
    if (!paragraph) {
      if (lines.length && lines.length < maxLines) lines.push('');
      continue;
    }

    const wrapped = wrapLines(ctx, paragraph, maxWidth, maxLines - lines.length);
    lines.push(...wrapped);
  }

  if (!lines.length) return wrapLines(ctx, 'Información descriptiva pendiente.', maxWidth, maxLines);
  return lines.slice(0, maxLines);
}

function drawLines(ctx, lines, x, y, lineHeight, color) {
  ctx.fillStyle = color;
  lines.forEach((line, index) => ctx.fillText(line, x, y + (index * lineHeight)));
}

function wrapDescriptionAllLines(ctx, value, maxWidth) {
  const paragraphs = String(value || 'Información descriptiva pendiente.')
    .replace(/\r\n?/g, '\n')
    .split('\n');

  const lines = [];
  paragraphs.forEach((rawParagraph) => {
    const paragraph = rawParagraph.trim();
    if (!paragraph) {
      if (lines.length) lines.push('');
      return;
    }
    lines.push(...wrapLines(ctx, paragraph, maxWidth));
  });

  return lines.length ? lines : ['Información descriptiva pendiente.'];
}

const normalizeIconLabel = (value) => String(value || '')
  .toLocaleLowerCase('es')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

function iconNameForLabel(label) {
  const text = normalizeIconLabel(label);
  if (/piscina|alberca|jacuzzi|agua/.test(text)) return 'waves';
  if (/jardin|patio|area verde|terraza verde/.test(text)) return 'tree';
  if (/cocina|comedor|desayunador/.test(text)) return 'utensils';
  if (/sala|living|estar familiar/.test(text)) return 'sofa';
  if (/oficina|estudio|despacho/.test(text)) return 'briefcase';
  if (/lavander|lavado/.test(text)) return 'laundry';
  if (/deposito|bodega|almacen/.test(text)) return 'box';
  if (/terraza|balcon|azotea|solarium/.test(text)) return 'sun';
  if (/closet|vestidor|walk-in/.test(text)) return 'shirt';
  if (/seguridad|vigilancia|garita|cerca electrica/.test(text)) return 'shield';
  if (/internet|wifi|senal/.test(text)) return 'wifi';
  if (/aire acondicionado|climatizacion/.test(text)) return 'snow';
  if (/electricidad|generador|planta electrica|energia/.test(text)) return 'zap';
  if (/habitacion|dormitorio|cuarto/.test(text)) return 'bed';
  if (/bano|sanitario/.test(text)) return 'bath';
  if (/parqueo|estacionamiento|garaje|garage/.test(text)) return 'car';
  if (/area|construccion|terreno|lote|tamano|medida|frente|fondo/.test(text)) return 'ruler';
  if (/ano|fecha/.test(text)) return 'calendar';
  if (/tipo de propiedad|estado|propiedad|residencial|casa|apartamento/.test(text)) return 'home';
  return 'check';
}

function drawContextIcon(ctx, label, x, y, size = 36) {
  const name = iconNameForLabel(label);
  const cx = x + (size / 2);
  const cy = y + (size / 2);
  const r = size / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
  ctx.fillStyle = '#FCFAF4';
  ctx.fill();
  ctx.strokeStyle = COLORS.goldLight;
  ctx.lineWidth = 1.4;
  ctx.stroke();

  ctx.strokeStyle = COLORS.gold;
  ctx.fillStyle = COLORS.gold;
  ctx.lineWidth = 1.7;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const left = x + 9;
  const right = x + size - 9;
  const top = y + 9;
  const bottom = y + size - 9;

  if (name === 'bed') {
    ctx.beginPath();
    ctx.moveTo(left, bottom); ctx.lineTo(left, top + 4); ctx.moveTo(left, cy); ctx.lineTo(right, cy);
    ctx.moveTo(left + 5, cy); ctx.lineTo(left + 5, top + 7); ctx.lineTo(cx, top + 7); ctx.lineTo(cx, cy);
    ctx.moveTo(right, cy); ctx.lineTo(right, bottom);
    ctx.stroke();
  } else if (name === 'bath') {
    ctx.beginPath();
    ctx.moveTo(left, cy); ctx.lineTo(right, cy);
    ctx.moveTo(left + 2, cy); ctx.quadraticCurveTo(left + 4, bottom, cx, bottom);
    ctx.quadraticCurveTo(right - 4, bottom, right - 2, cy);
    ctx.moveTo(left + 5, cy); ctx.lineTo(left + 5, top + 4); ctx.quadraticCurveTo(left + 5, top, left + 10, top);
    ctx.stroke();
  } else if (name === 'car') {
    ctx.strokeRect(left + 1, cy - 4, right - left - 2, 9);
    ctx.beginPath(); ctx.arc(left + 6, bottom - 1, 2, 0, Math.PI * 2); ctx.arc(right - 6, bottom - 1, 2, 0, Math.PI * 2); ctx.stroke();
  } else if (name === 'waves') {
    [cy - 6, cy, cy + 6].forEach((waveY) => {
      ctx.beginPath();
      ctx.moveTo(left, waveY);
      ctx.bezierCurveTo(left + 4, waveY - 4, left + 7, waveY + 4, cx, waveY);
      ctx.bezierCurveTo(cx + 3, waveY - 4, right - 4, waveY + 4, right, waveY);
      ctx.stroke();
    });
  } else if (name === 'tree') {
    ctx.beginPath(); ctx.moveTo(cx, bottom); ctx.lineTo(cx, cy + 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(left + 3, cy + 4); ctx.lineTo(cx - 4, cy + 4); ctx.lineTo(left + 1, bottom - 3); ctx.lineTo(right - 1, bottom - 3); ctx.lineTo(cx + 4, cy + 4); ctx.lineTo(right - 3, cy + 4); ctx.closePath(); ctx.stroke();
  } else if (name === 'utensils') {
    ctx.beginPath(); ctx.moveTo(left + 4, top); ctx.lineTo(left + 4, bottom); ctx.moveTo(left, top); ctx.lineTo(left, cy - 2); ctx.quadraticCurveTo(left + 4, cy + 2, left + 8, cy - 2); ctx.lineTo(left + 8, top); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(right - 4, top); ctx.lineTo(right - 4, bottom); ctx.moveTo(right - 4, top); ctx.quadraticCurveTo(right + 1, cy - 3, right - 4, cy + 1); ctx.stroke();
  } else if (name === 'sofa') {
    ctx.strokeRect(left + 2, cy, right - left - 4, bottom - cy - 2);
    ctx.beginPath(); ctx.moveTo(left + 5, cy); ctx.lineTo(left + 5, top + 5); ctx.quadraticCurveTo(cx, top, right - 5, top + 5); ctx.lineTo(right - 5, cy); ctx.stroke();
  } else if (name === 'briefcase') {
    ctx.strokeRect(left, cy - 4, right - left, bottom - cy + 4);
    ctx.beginPath(); ctx.moveTo(cx - 5, cy - 4); ctx.lineTo(cx - 5, top + 3); ctx.lineTo(cx + 5, top + 3); ctx.lineTo(cx + 5, cy - 4); ctx.stroke();
  } else if (name === 'laundry') {
    ctx.strokeRect(left + 2, top, right - left - 4, bottom - top);
    ctx.beginPath(); ctx.arc(cx, cy + 3, 6, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(left + 6, top + 5, 1, 0, Math.PI * 2); ctx.fill();
  } else if (name === 'box') {
    ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(right, top + 5); ctx.lineTo(cx, cy); ctx.lineTo(left, top + 5); ctx.closePath();
    ctx.moveTo(left, top + 5); ctx.lineTo(left, bottom - 2); ctx.lineTo(cx, bottom + 2); ctx.lineTo(right, bottom - 2); ctx.lineTo(right, top + 5); ctx.moveTo(cx, cy); ctx.lineTo(cx, bottom + 2); ctx.stroke();
  } else if (name === 'sun') {
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.stroke();
    [[0,-10],[0,10],[-10,0],[10,0],[-7,-7],[7,7],[-7,7],[7,-7]].forEach(([dx,dy]) => { ctx.beginPath(); ctx.moveTo(cx + dx*.7, cy + dy*.7); ctx.lineTo(cx + dx, cy + dy); ctx.stroke(); });
  } else if (name === 'shield') {
    ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(right, top + 4); ctx.lineTo(right - 2, cy + 5); ctx.quadraticCurveTo(cx, bottom + 2, left + 2, cy + 5); ctx.lineTo(left, top + 4); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 4, cy); ctx.lineTo(cx - 1, cy + 3); ctx.lineTo(cx + 5, cy - 4); ctx.stroke();
  } else if (name === 'wifi') {
    [10,7,4].forEach((radius, index) => { ctx.beginPath(); ctx.arc(cx, bottom, radius, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); });
    ctx.beginPath(); ctx.arc(cx, bottom - 1, 1.5, 0, Math.PI * 2); ctx.fill();
  } else if (name === 'snow') {
    ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(cx, bottom); ctx.moveTo(left, cy); ctx.lineTo(right, cy); ctx.moveTo(left + 2, top + 2); ctx.lineTo(right - 2, bottom - 2); ctx.moveTo(right - 2, top + 2); ctx.lineTo(left + 2, bottom - 2); ctx.stroke();
  } else if (name === 'zap') {
    ctx.beginPath(); ctx.moveTo(cx + 2, top); ctx.lineTo(left + 3, cy + 2); ctx.lineTo(cx, cy + 2); ctx.lineTo(cx - 2, bottom); ctx.lineTo(right - 3, cy - 2); ctx.lineTo(cx, cy - 2); ctx.closePath(); ctx.stroke();
  } else if (name === 'calendar') {
    ctx.strokeRect(left, top + 3, right - left, bottom - top - 3);
    ctx.beginPath(); ctx.moveTo(left, top + 9); ctx.lineTo(right, top + 9); ctx.moveTo(left + 5, top); ctx.lineTo(left + 5, top + 6); ctx.moveTo(right - 5, top); ctx.lineTo(right - 5, top + 6); ctx.stroke();
  } else if (name === 'home') {
    ctx.beginPath(); ctx.moveTo(left, cy); ctx.lineTo(cx, top); ctx.lineTo(right, cy); ctx.moveTo(left + 3, cy - 2); ctx.lineTo(left + 3, bottom); ctx.lineTo(right - 3, bottom); ctx.lineTo(right - 3, cy - 2); ctx.stroke();
  } else if (name === 'ruler') {
    ctx.beginPath(); ctx.moveTo(left + 1, bottom - 2); ctx.lineTo(right - 2, top + 1); ctx.lineTo(right + 1, top + 4); ctx.lineTo(left + 4, bottom + 1); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 4, cy + 1); ctx.lineTo(cx - 1, cy + 4); ctx.moveTo(cx + 1, cy - 4); ctx.lineTo(cx + 4, cy - 1); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(left + 2, cy); ctx.lineTo(cx - 2, bottom - 4); ctx.lineTo(right - 1, top + 4); ctx.stroke();
  }

  ctx.restore();
}

function buildTechnicalDetails(property) {
  const unit = property.areaUnit || 'm²';
  const typeLabel = labelFor(propertyTypeOptions, property.propertyType, 'Propiedad');
  const operationLabel = labelFor(operationTypeOptions, normalizeOperation(property.operationType || property.transactionType), 'Operación');
  const statusLabel = labelFor(propertyStatusOptions, property.status || 'available', 'Disponible');

  return [
    { label: 'Tipo de propiedad', value: typeLabel },
    { label: 'Operación', value: operationLabel },
    { label: 'Estado', value: statusLabel },
    (property.constructionArea || property.builtArea) && {
      label: 'Área de construcción',
      value: `${property.constructionArea || property.builtArea} ${unit}`,
    },
    property.landArea && { label: 'Tamaño del terreno', value: `${property.landArea} ${unit}` },
    property.bedrooms && { label: 'Dormitorios', value: String(property.bedrooms) },
    property.bathrooms && { label: 'Baños', value: String(property.bathrooms) },
    property.parkingSpaces && { label: 'Estacionamientos', value: String(property.parkingSpaces) },
    property.yearBuilt && { label: 'Año de construcción', value: String(property.yearBuilt) },
    ...buildDynamicDetails(property),
  ].filter(Boolean)
    .filter((item, index, values) => values.findIndex((candidate) => candidate.label === item.label) === index);
}

async function blobToImage(blob) {
  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = objectUrl;
    });
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function fetchImageBlob(url) {
  const response = await fetch(url, { mode: 'cors', cache: 'force-cache' });
  if (!response.ok) throw new Error('No se pudo cargar la imagen');
  const blob = await response.blob();
  if (!blob.type.startsWith('image/')) throw new Error('El recurso no es una imagen');
  return blob;
}

async function loadImage(url) {
  if (!url) return null;

  try {
    return await blobToImage(await fetchImageBlob(url));
  } catch {
    // Firebase Storage puede mostrar la imagen en <img> y aun bloquear su lectura
    // desde canvas. En Vercel usamos un proxy mismo-origen como respaldo.
  }

  try {
    const parsed = new URL(url);
    const isFirebase = parsed.hostname === 'firebasestorage.googleapis.com'
      || parsed.hostname === 'storage.googleapis.com';
    const canUseProxy = typeof window !== 'undefined'
      && !window.location.hostname.endsWith('github.io')
      && isFirebase;
    if (!canUseProxy) return null;

    const proxyUrl = `/api/property-image?url=${encodeURIComponent(url)}`;
    return await blobToImage(await fetchImageBlob(proxyUrl));
  } catch {
    return null;
  }
}

function drawImageCover(ctx, image, x, y, width, height) {
  if (!image?.width || !image?.height) {
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, COLORS.navySoft);
    gradient.addColorStop(1, COLORS.navy);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
    return false;
  }

  const scale = Math.max(width / image.width, height / image.height);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = Math.max(0, (image.width - sourceWidth) / 2);
  const sourceY = Math.max(0, (image.height - sourceHeight) / 2);
  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
  return true;
}

function drawPremiumGallery(ctx, images, width, height) {
  if (!images.length) {
    drawImageCover(ctx, null, 0, 0, width, height);
    return false;
  }

  ctx.fillStyle = COLORS.navy;
  ctx.fillRect(0, 0, width, height);
  const margin = 20;
  const gap = 12;
  const leftWidth = 790;
  const rightWidth = width - (margin * 2) - gap - leftWidth;
  const smallHeight = (height - (margin * 2) - gap) / 2;
  const frames = [
    { x: margin, y: margin, width: leftWidth, height: height - (margin * 2) },
    { x: margin + leftWidth + gap, y: margin, width: rightWidth, height: smallHeight },
    { x: margin + leftWidth + gap, y: margin + smallHeight + gap, width: rightWidth, height: smallHeight },
  ];

  frames.forEach((frame, index) => {
    ctx.save();
    roundedRectPath(ctx, frame.x, frame.y, frame.width, frame.height, 18);
    ctx.clip();
    drawImageCover(ctx, images[index] || null, frame.x, frame.y, frame.width, frame.height);
    ctx.fillStyle = index === 0 ? 'rgba(0,25,41,.24)' : 'rgba(0,25,41,.14)';
    ctx.fillRect(frame.x, frame.y, frame.width, frame.height);
    ctx.restore();
    strokeRoundedRect(ctx, frame.x, frame.y, frame.width, frame.height, 18, COLORS.goldLight, 2);
  });
  return true;
}

function drawPdfFooter(ctx, {
  y,
  faviconImage,
  partnerLogoImage,
  leftNote = '',
  rightNote = '',
}) {
  ctx.fillStyle = COLORS.navy;
  ctx.fillRect(0, y, PAGE.width, PAGE.height - y);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(0, y, PAGE.width, 5);

  const leftCenter = 332;
  const partnerCenter = 960;

  if (faviconImage) {
    ctx.save();
    roundedRectPath(ctx, 104, y + 28, 58, 58, 12);
    ctx.clip();
    ctx.drawImage(faviconImage, 104, y + 28, 58, 58);
    ctx.restore();
  }

  ctx.fillStyle = COLORS.white;
  ctx.font = '800 21px Arial, sans-serif';
  ctx.fillText('Amy Blandón', 180, y + 50);
  ctx.fillStyle = COLORS.goldLight;
  ctx.font = '700 11px Arial, sans-serif';
  ctx.fillText('ASESORÍA INMOBILIARIA · SEGUROS · INVERSIONES', 180, y + 75);

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,.82)';
  ctx.font = '600 11px Arial, sans-serif';
  ctx.fillText(
    `${amyContact.phone}   ·   ${amyContact.email}   ·   amyblandon.com`,
    leftCenter,
    y + 126,
  );

  if (partnerLogoImage) {
    const logoWidth = 116;
    const logoHeight = 112;
    ctx.drawImage(
      partnerLogoImage,
      partnerCenter - (logoWidth / 2),
      y + 18,
      logoWidth,
      logoHeight,
    );
  }

  ctx.fillStyle = COLORS.goldLight;
  ctx.font = '700 11px Arial, sans-serif';
  ctx.fillText('CARNET INMOBILIARIO · 0153-2026-A-1', partnerCenter, y + 151);

  ctx.fillStyle = 'rgba(255,255,255,.38)';
  ctx.font = '500 10px Arial, sans-serif';
  ctx.textAlign = 'left';
  if (leftNote) ctx.fillText(leftNote, 70, PAGE.height - 22);
  ctx.textAlign = 'right';
  if (rightNote) ctx.fillText(rightNote, 1170, PAGE.height - 22);
  ctx.textAlign = 'left';
}

function drawDetailsPage(ctx, property, faviconImage, partnerLogoImage) {
  ctx.fillStyle = COLORS.ivory;
  ctx.fillRect(0, 0, PAGE.width, PAGE.height);

  ctx.fillStyle = COLORS.navy;
  ctx.fillRect(0, 0, PAGE.width, 18);

  ctx.fillStyle = COLORS.gold;
  ctx.font = '800 14px Arial, sans-serif';
  ctx.fillText('FICHA TÉCNICA · DETALLES', 70, 88);

  ctx.fillStyle = COLORS.navy;
  ctx.font = '800 42px Arial, sans-serif';
  ctx.fillText('Áreas y características', 70, 142);

  ctx.fillStyle = COLORS.muted;
  ctx.font = '500 16px Arial, sans-serif';
  const subtitle = cleanText(property.title || 'Propiedad');
  drawLines(ctx, wrapLines(ctx, subtitle, 1000, 1), 70, 180, 24, COLORS.muted);

  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(70, 205, 92, 4);

  const amenities = buildPublicAmenities(property);
  const amenityTop = 278;
  const amenityLeft = 72;
  const amenityColumnGap = 54;
  const amenityColumnWidth = 520;
  const amenityRows = Math.max(1, Math.ceil(amenities.length / 2));
  const amenityRowStep = Math.max(38, Math.min(58, 500 / amenityRows));

  ctx.fillStyle = COLORS.navy;
  ctx.font = '800 22px Arial, sans-serif';
  ctx.fillText('ÁREAS Y CARACTERÍSTICAS', 70, 250);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(70, 262, 66, 4);

  if (!amenities.length) {
    ctx.fillStyle = COLORS.muted;
    ctx.font = '500 16px Arial, sans-serif';
    ctx.fillText('No hay características adicionales registradas para esta propiedad.', 70, amenityTop + 32);
  } else {
    amenities.slice(0, 28).forEach((amenity, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const x = amenityLeft + (column * (amenityColumnWidth + amenityColumnGap));
      const y = amenityTop + (row * amenityRowStep);

      ctx.beginPath();
      ctx.arc(x + 15, y + 15, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#FCFAF4';
      ctx.fill();
      ctx.strokeStyle = COLORS.goldLight;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.strokeStyle = COLORS.gold;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x + 9, y + 15);
      ctx.lineTo(x + 13, y + 19);
      ctx.lineTo(x + 21, y + 10);
      ctx.stroke();

      ctx.fillStyle = COLORS.muted;
      ctx.font = '500 16px Arial, sans-serif';
      const lines = wrapLines(ctx, cleanText(amenity), amenityColumnWidth - 54, 2);
      drawLines(ctx, lines, x + 44, y + 20, 19, COLORS.muted);
    });

    if (amenities.length > 28) {
      ctx.fillStyle = COLORS.gold;
      ctx.font = '700 12px Arial, sans-serif';
      ctx.fillText(`+${amenities.length - 28} características adicionales`, 70, 818);
    }
  }

  const details = buildDynamicDetails(property);
  const detailsTop = 890;

  ctx.fillStyle = COLORS.navy;
  ctx.font = '800 24px Arial, sans-serif';
  ctx.fillText('Detalles adicionales de la propiedad', 70, 850);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(70, 865, 82, 4);

  if (!details.length) {
    ctx.fillStyle = COLORS.muted;
    ctx.font = '500 16px Arial, sans-serif';
    ctx.fillText('No hay detalles específicos adicionales registrados.', 70, detailsTop + 30);
  } else {
    const detailWidth = 532;
    const detailGap = 36;
    const detailHeight = 66;
    const detailRowGap = 10;

    details.slice(0, 16).forEach((item, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const x = 70 + (column * (detailWidth + detailGap));
      const y = detailsTop + (row * (detailHeight + detailRowGap));

      fillRoundedRect(ctx, x, y, detailWidth, detailHeight, 12, COLORS.white);
      strokeRoundedRect(ctx, x, y, detailWidth, detailHeight, 12, COLORS.border, 1.2);

      ctx.fillStyle = COLORS.gold;
      ctx.font = '700 11px Arial, sans-serif';
      ctx.fillText(cleanText(item.label).toUpperCase().slice(0, 52), x + 20, y + 22);

      ctx.fillStyle = COLORS.text;
      ctx.font = '700 15px Arial, sans-serif';
      const valueLines = wrapLines(ctx, cleanText(item.value), detailWidth - 40, 2);
      drawLines(ctx, valueLines, x + 20, y + 46, 17, COLORS.text);
    });

    if (details.length > 16) {
      ctx.fillStyle = COLORS.gold;
      ctx.font = '700 11px Arial, sans-serif';
      ctx.fillText(`+${details.length - 16} detalles adicionales registrados`, 70, 1515);
    }
  }

  drawPdfFooter(ctx, {
    y: 1545,
    faviconImage,
    partnerLogoImage,
    rightNote: 'Página 2 de 3',
  });
}

function drawGalleryPage(ctx, images, property, faviconImage, partnerLogoImage) {
  ctx.fillStyle = COLORS.ivory;
  ctx.fillRect(0, 0, PAGE.width, PAGE.height);

  ctx.fillStyle = COLORS.navy;
  ctx.fillRect(0, 0, PAGE.width, 18);

  ctx.fillStyle = COLORS.gold;
  ctx.font = '800 14px Arial, sans-serif';
  ctx.fillText('FICHA TÉCNICA · GALERÍA', 70, 88);

  ctx.fillStyle = COLORS.navy;
  ctx.font = '800 42px Arial, sans-serif';
  ctx.fillText('Galería de fotos', 70, 142);

  ctx.fillStyle = COLORS.muted;
  ctx.font = '500 16px Arial, sans-serif';
  const subtitle = cleanText(property.title || 'Propiedad');
  const subtitleLines = wrapLines(ctx, subtitle, 1000, 1);
  drawLines(ctx, subtitleLines, 70, 180, 24, COLORS.muted);

  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(70, 205, 92, 4);

  const left = 70;
  const top = 250;
  const totalWidth = 1100;
  const totalHeight = 1230;
  const columnGap = 24;
  const rowGap = 20;
  const frameWidth = (totalWidth - columnGap) / 2;
  const frameHeight = (totalHeight - (rowGap * 3)) / 4;

  for (let index = 0; index < 8; index += 1) {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = left + (column * (frameWidth + columnGap));
    const y = top + (row * (frameHeight + rowGap));
    const image = images[index] || null;

    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x, y, frameWidth, frameHeight);

    if (image) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x + 3, y + 3, frameWidth - 6, frameHeight - 6);
      ctx.clip();
      drawImageCover(ctx, image, x + 3, y + 3, frameWidth - 6, frameHeight - 6);
      ctx.restore();
    } else {
      ctx.fillStyle = '#EEEAE1';
      ctx.fillRect(x + 3, y + 3, frameWidth - 6, frameHeight - 6);
      ctx.fillStyle = '#9A9488';
      ctx.font = '600 13px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Fotografía no disponible', x + (frameWidth / 2), y + (frameHeight / 2));
      ctx.textAlign = 'left';
    }

    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, frameWidth, frameHeight);
  }

  drawPdfFooter(ctx, {
    y: 1545,
    faviconImage,
    partnerLogoImage,
    rightNote: 'Página 3 de 3',
  });
}

function drawMetricIcon(ctx, kind, x, y, size = 54) {
  fillRoundedRect(ctx, x, y, size, size, 12, COLORS.navy);
  ctx.save();
  ctx.strokeStyle = COLORS.goldLight;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const left = x + 13;
  const top = y + 14;
  const right = x + size - 13;
  const bottom = y + size - 14;

  if (kind === 'bedrooms') {
    ctx.beginPath();
    ctx.moveTo(left, bottom - 4); ctx.lineTo(left, top + 7); ctx.lineTo(left + 8, top + 7);
    ctx.moveTo(left + 8, top + 7); ctx.lineTo(left + 8, top + 17); ctx.lineTo(right, top + 17); ctx.lineTo(right, bottom - 4);
    ctx.moveTo(left, bottom - 10); ctx.lineTo(right, bottom - 10);
    ctx.stroke();
  } else if (kind === 'bathrooms') {
    ctx.beginPath();
    ctx.moveTo(left, top + 17); ctx.lineTo(right, top + 17);
    ctx.moveTo(left + 2, top + 17); ctx.quadraticCurveTo(left + 4, bottom, left + 12, bottom);
    ctx.lineTo(right - 9, bottom); ctx.quadraticCurveTo(right - 2, bottom, right, top + 17);
    ctx.moveTo(left + 8, top + 17); ctx.lineTo(left + 8, top + 7); ctx.quadraticCurveTo(left + 8, top + 2, left + 14, top + 2);
    ctx.stroke();
  } else if (kind === 'parking') {
    ctx.beginPath();
    ctx.moveTo(left + 2, bottom - 5); ctx.lineTo(left + 5, top + 13); ctx.lineTo(right - 5, top + 13); ctx.lineTo(right - 2, bottom - 5); ctx.closePath();
    ctx.moveTo(left + 8, top + 13); ctx.lineTo(left + 13, top + 6); ctx.lineTo(right - 13, top + 6); ctx.lineTo(right - 8, top + 13);
    ctx.stroke();
    ctx.beginPath(); ctx.arc(left + 9, bottom - 3, 3, 0, Math.PI * 2); ctx.arc(right - 9, bottom - 3, 3, 0, Math.PI * 2); ctx.stroke();
  } else if (kind === 'year') {
    ctx.strokeRect(left + 2, top + 5, right - left - 4, bottom - top - 7);
    ctx.beginPath(); ctx.moveTo(left + 2, top + 14); ctx.lineTo(right - 2, top + 14); ctx.moveTo(left + 10, top + 1); ctx.lineTo(left + 10, top + 9); ctx.moveTo(right - 10, top + 1); ctx.lineTo(right - 10, top + 9); ctx.stroke();
  } else {
    ctx.strokeRect(left + 3, top + 3, right - left - 6, bottom - top - 6);
    ctx.beginPath();
    ctx.moveTo(left, top + 9); ctx.lineTo(left + 9, top + 9); ctx.moveTo(left, top + 9); ctx.lineTo(left, top + 18);
    ctx.moveTo(right, bottom - 9); ctx.lineTo(right - 9, bottom - 9); ctx.moveTo(right, bottom - 9); ctx.lineTo(right, bottom - 18);
    ctx.stroke();
  }
  ctx.restore();
}

function optionLabel(definition, value) {
  if (!definition?.options?.length) return value;
  return definition.options.find(([optionValue]) => optionValue === value)?.[1] || value;
}

function buildFacts(property) {
  const unit = property.areaUnit || 'm²';
  return [
    property.bedrooms && { key: 'bedrooms', label: 'Habitaciones', value: String(property.bedrooms) },
    property.bathrooms && { key: 'bathrooms', label: 'Baños', value: String(property.bathrooms) },
    property.parkingSpaces && { key: 'parking', label: 'Parqueos', value: String(property.parkingSpaces) },
    (property.constructionArea || property.builtArea) && { key: 'construction', label: 'Construcción', value: `${property.constructionArea || property.builtArea} ${unit}` },
    property.landArea && { key: 'land', label: 'Terreno', value: `${property.landArea} ${unit}` },
    property.yearBuilt && { key: 'year', label: 'Año', value: String(property.yearBuilt) },
  ].filter(Boolean).slice(0, 5);
}

function buildDynamicDetails(property) {
  return getDynamicFields(property.propertyType)
    .map((definition) => {
      const value = property.propertyDetails?.[definition.key];
      if (value === undefined || value === null || value === '' || Number(value) === 0) return null;
      return { label: definition.label, value: cleanText(optionLabel(definition, value)) };
    })
    .filter(Boolean);
}

function buildPublicAmenities(property) {
  const structuredAmenities = [
    ...asList(property.features),
    ...asList(property.services),
  ].filter((item, index, values) => values.indexOf(item) === index);

  return (property._hasStructuredAmenities
    ? structuredAmenities
    : [...asList(property.amenities), ...structuredAmenities])
    .filter((item, index, values) => item && values.indexOf(item) === index);
}

function canvasToJpegBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('No se pudo preparar la imagen del PDF.'));
    }, 'image/jpeg', 0.94);
  });
}

const asciiBytes = (value) => new TextEncoder().encode(value);
function concatBytes(chunks) {
  const size = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const output = new Uint8Array(size);
  let offset = 0;
  chunks.forEach((chunk) => {
    output.set(chunk, offset);
    offset += chunk.length;
  });
  return output;
}

async function multiPagePdfFromCanvases(canvases) {
  if (!Array.isArray(canvases) || !canvases.length) {
    throw new Error('No hay páginas para generar el PDF.');
  }

  const pages = await Promise.all(canvases.map(async (canvas) => {
    const jpegBlob = await canvasToJpegBlob(canvas);
    return {
      canvas,
      jpegBytes: new Uint8Array(await jpegBlob.arrayBuffer()),
    };
  }));

  const chunks = [];
  const offsets = [0];
  let length = 0;
  const append = (value) => {
    const bytes = typeof value === 'string' ? asciiBytes(value) : value;
    chunks.push(bytes);
    length += bytes.length;
  };
  const addObject = (number, body) => {
    offsets[number] = length;
    append(`${number} 0 obj\n${body}\nendobj\n`);
  };

  const pageObjectNumbers = pages.map((_, index) => 3 + (index * 3));
  const objectCount = 2 + (pages.length * 3);

  append('%PDF-1.4\n');
  addObject(1, '<< /Type /Catalog /Pages 2 0 R >>');
  addObject(
    2,
    `<< /Type /Pages /Kids [${pageObjectNumbers.map((number) => `${number} 0 R`).join(' ')}] /Count ${pages.length} >>`,
  );

  pages.forEach(({ canvas, jpegBytes }, index) => {
    const pageObject = 3 + (index * 3);
    const imageObject = pageObject + 1;
    const contentObject = pageObject + 2;
    const imageName = `Im${index}`;

    addObject(
      pageObject,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /${imageName} ${imageObject} 0 R >> >> /Contents ${contentObject} 0 R >>`,
    );

    offsets[imageObject] = length;
    append(`${imageObject} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`);
    append(jpegBytes);
    append('\nendstream\nendobj\n');

    const content = `q\n595.28 0 0 841.89 0 0 cm\n/${imageName} Do\nQ`;
    addObject(contentObject, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });

  const xrefOffset = length;
  append(`xref\n0 ${objectCount + 1}\n0000000000 65535 f \n`);
  for (let index = 1; index <= objectCount; index += 1) {
    append(`${String(offsets[index]).padStart(10, '0')} 00000 n \n`);
  }
  append(`trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  return new Blob([concatBytes(chunks)], { type: 'application/pdf' });
}

export async function downloadPropertyTechnicalSheetPdf(property) {
  if (!property) throw new Error('No hay datos de propiedad para generar la ficha.');

  const canvas = document.createElement('canvas');
  canvas.width = PAGE.width;
  canvas.height = PAGE.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('El navegador no pudo preparar el documento.');

  ctx.fillStyle = COLORS.ivory;
  ctx.fillRect(0, 0, PAGE.width, PAGE.height);

  const decodedGallery = Array.isArray(property.pdfGalleryBitmaps)
    ? property.pdfGalleryBitmaps.filter((image) => image?.width && image?.height).slice(0, 8)
    : [];
  const preparedGallery = Array.isArray(property.pdfGalleryImages)
    ? property.pdfGalleryImages.map(imageUrl).filter(Boolean).slice(0, 8)
    : [];
  const galleryImages = decodedGallery.length
    ? decodedGallery
    : (await Promise.all(preparedGallery.map(loadImage))).filter(Boolean);
  const configuredFavicon = typeof document !== 'undefined'
    ? document.querySelector('link[rel~="icon"]')?.href
    : '';
  const faviconImage = await loadImage(configuredFavicon || `${import.meta.env.BASE_URL}favicon-amy.svg`);
  const partnerLogoImage = await loadImage(`${import.meta.env.BASE_URL}images/diamantes-realty-group-logo.png`);
  const heroHeight = 560;
  const hasCover = drawPremiumGallery(ctx, galleryImages.slice(0, 3), PAGE.width, heroHeight);

  if (hasCover) {
    const sideOverlay = ctx.createLinearGradient(0, 0, PAGE.width, 0);
    sideOverlay.addColorStop(0, 'rgba(0,25,41,.70)');
    sideOverlay.addColorStop(.48, 'rgba(0,25,41,.42)');
    sideOverlay.addColorStop(.78, 'rgba(0,25,41,.14)');
    sideOverlay.addColorStop(1, 'rgba(0,25,41,.03)');
    ctx.fillStyle = sideOverlay;
    ctx.fillRect(0, 0, PAGE.width, heroHeight);

    const bottomOverlay = ctx.createLinearGradient(0, 250, 0, heroHeight);
    bottomOverlay.addColorStop(0, 'rgba(0,25,41,0)');
    bottomOverlay.addColorStop(1, 'rgba(0,25,41,.38)');
    ctx.fillStyle = bottomOverlay;
    ctx.fillRect(0, 0, PAGE.width, heroHeight);
  }

  ctx.fillStyle = COLORS.goldLight;
  ctx.font = '700 34px Georgia, serif';
  ctx.fillText('AMY BLANDÓN', 70, 76);
  ctx.fillStyle = 'rgba(255,255,255,.92)';
  ctx.font = '500 17px Arial, sans-serif';
  ctx.fillText('ASESORA INMOBILIARIA | SEGUROS | INVERSIONES', 72, 107);

  fillRoundedRect(ctx, 918, 48, 250, 62, 31, 'rgba(0,25,41,.78)');
  strokeRoundedRect(ctx, 918, 48, 250, 62, 31, COLORS.goldLight, 2);
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.white;
  ctx.font = '700 17px Arial, sans-serif';
  ctx.fillText('FICHA TÉCNICA', 1043, 87);
  ctx.textAlign = 'left';

  const typeLabel = labelFor(propertyTypeOptions, property.propertyType, 'Propiedad');
  const operationLabel = labelFor(operationTypeOptions, normalizeOperation(property.operationType || property.transactionType), 'Disponible');
  const location = cleanText(property.publicAddress || [property.sector, property.city, property.department].filter(Boolean).join(', ') || 'Nicaragua');
  const price = property.priceOnRequest ? 'Precio a consultar' : formatMoney(property.price, property.currency);

  fillRoundedRect(ctx, 70, 290, 170, 42, 21, COLORS.gold);
  ctx.fillStyle = COLORS.navy;
  ctx.font = '800 15px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(operationLabel.toUpperCase(), 155, 317);
  ctx.textAlign = 'left';

  ctx.fillStyle = COLORS.white;
  ctx.font = '800 47px Arial, sans-serif';
  const titleLines = wrapLines(ctx, property.title || 'Propiedad', 790, 2);
  drawLines(ctx, titleLines, 70, 383, 55, COLORS.white);
  const titleBottom = 383 + ((titleLines.length - 1) * 55);

  ctx.fillStyle = 'rgba(255,255,255,.88)';
  ctx.font = '500 19px Arial, sans-serif';
  const locationLine = `${typeLabel} · ${location}`;
  const locationLines = wrapLines(ctx, locationLine, 820, 1);
  drawLines(ctx, locationLines, 72, titleBottom + 43, 26, 'rgba(255,255,255,.88)');

  ctx.fillStyle = COLORS.goldLight;
  ctx.font = '800 33px Arial, sans-serif';
  ctx.fillText(price, 72, titleBottom + 87);

  if (property.internalCode) {
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,.8)';
    ctx.font = '600 14px Arial, sans-serif';
    ctx.fillText(`CÓDIGO ${cleanText(property.internalCode).toUpperCase()}`, 1168, titleBottom + 86);
    ctx.textAlign = 'left';
  }

  const facts = buildFacts(property);
  const metricsY = 600;
  const metricsX = 70;
  const metricsWidth = 1100;
  const gap = 14;
  const count = Math.max(facts.length, 1);
  const metricWidth = (metricsWidth - (gap * (count - 1))) / count;

  if (facts.length) {
    facts.forEach((fact, index) => {
      const x = metricsX + (index * (metricWidth + gap));
      fillRoundedRect(ctx, x, metricsY, metricWidth, 118, 18, COLORS.white);
      strokeRoundedRect(ctx, x, metricsY, metricWidth, 118, 18, COLORS.border, 1.5);
      drawMetricIcon(ctx, fact.key, x + 17, metricsY + 31, 54);
      ctx.fillStyle = COLORS.muted;
      ctx.font = '700 12px Arial, sans-serif';
      ctx.fillText(fact.label.toUpperCase(), x + 84, metricsY + 44);
      ctx.fillStyle = COLORS.text;
      ctx.font = '800 21px Arial, sans-serif';
      const metricLines = wrapLines(ctx, fact.value, metricWidth - 102, 2);
      drawLines(ctx, metricLines, x + 84, metricsY + 73, 23, COLORS.text);
    });
  }

  const descriptionY = 770;
  ctx.fillStyle = COLORS.gold;
  ctx.font = '800 14px Arial, sans-serif';
  ctx.fillText('PRESENTACIÓN DE LA PROPIEDAD', 70, descriptionY);
  ctx.fillStyle = COLORS.text;
  ctx.font = '800 30px Arial, sans-serif';
  ctx.fillText('Descripción', 70, descriptionY + 45);
  ctx.fillStyle = COLORS.muted;
  ctx.font = '500 18px Arial, sans-serif';
  ctx.textAlign = 'left';
  const descriptionLines = wrapDescriptionLines(
    ctx,
    property.description || 'Información descriptiva pendiente.',
    1100,
    22,
  );
  drawLines(ctx, descriptionLines, 70, descriptionY + 86, 29, COLORS.muted);

  drawPdfFooter(ctx, {
    y: 1550,
    faviconImage,
    partnerLogoImage,
    leftNote: 'Ficha comercial informativa · Datos sujetos a verificación y disponibilidad.',
    rightNote: `Página 1 de 3 · Generada ${new Date().toLocaleDateString('es-NI')}`,
  });

  const detailsCanvas = document.createElement('canvas');
  detailsCanvas.width = PAGE.width;
  detailsCanvas.height = PAGE.height;
  const detailsCtx = detailsCanvas.getContext('2d');
  if (!detailsCtx) throw new Error('El navegador no pudo preparar la página de detalles.');
  drawDetailsPage(detailsCtx, property, faviconImage, partnerLogoImage);

  const galleryCanvas = document.createElement('canvas');
  galleryCanvas.width = PAGE.width;
  galleryCanvas.height = PAGE.height;
  const galleryCtx = galleryCanvas.getContext('2d');
  if (!galleryCtx) throw new Error('El navegador no pudo preparar la galería del documento.');
  drawGalleryPage(galleryCtx, galleryImages.slice(0, 8), property, faviconImage, partnerLogoImage);

  const pdfBlob = await multiPagePdfFromCanvases([canvas, detailsCanvas, galleryCanvas]);
  const objectUrl = URL.createObjectURL(pdfBlob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = `ficha-tecnica-${safeFileName(property.slug || property.title)}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
}
