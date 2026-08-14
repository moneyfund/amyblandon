import { amyContact } from '../content/homePage.es';
import { getDynamicFields } from '../config/propertyWorkspace.es';
import {
  labelFor,
  operationTypeOptions,
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

const imageUrl = (image) => {
  if (typeof image === 'string') return image;
  return image?.url || '';
};

const cleanText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

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

function drawLines(ctx, lines, x, y, lineHeight, color) {
  ctx.fillStyle = color;
  lines.forEach((line, index) => ctx.fillText(line, x, y + (index * lineHeight)));
}

async function loadImage(url) {
  if (!url) return null;
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('image fetch failed');
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = objectUrl;
    });
    URL.revokeObjectURL(objectUrl);
    return image;
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
    return;
  }

  const scale = Math.max(width / image.width, height / image.height);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = Math.max(0, (image.width - sourceWidth) / 2);
  const sourceY = Math.max(0, (image.height - sourceHeight) / 2);
  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
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
      if (value === undefined || value === null || value === '' || value === 'no') return null;
      return { label: definition.label, value: cleanText(optionLabel(definition, value)) };
    })
    .filter(Boolean)
    .slice(0, 5);
}

function canvasToJpegBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('No se pudo preparar la imagen del PDF.'));
    }, 'image/jpeg', 0.93);
  });
}

function asciiBytes(value) {
  return new TextEncoder().encode(value);
}

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

async function singlePagePdfFromCanvas(canvas) {
  const jpegBlob = await canvasToJpegBlob(canvas);
  const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());
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

  append('%PDF-1.4\n');
  addObject(1, '<< /Type /Catalog /Pages 2 0 R >>');
  addObject(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  addObject(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');

  offsets[4] = length;
  append(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`);
  append(jpegBytes);
  append('\nendstream\nendobj\n');

  const content = 'q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ';
  addObject(5, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

  const xrefOffset = length;
  append('xref\n0 6\n');
  append('0000000000 65535 f \n');
  for (let index = 1; index <= 5; index += 1) {
    append(`${String(offsets[index]).padStart(10, '0')} 00000 n \n`);
  }
  append(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

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

  const gallery = Array.isArray(property.images) ? property.images : [property.images];
  const coverUrl = imageUrl(property.coverImage) || gallery.map(imageUrl).find(Boolean) || '';
  const cover = await loadImage(coverUrl);
  drawImageCover(ctx, cover, 0, 0, PAGE.width, 610);

  const overlay = ctx.createLinearGradient(0, 80, 0, 610);
  overlay.addColorStop(0, 'rgba(0,25,41,.18)');
  overlay.addColorStop(.55, 'rgba(0,25,41,.48)');
  overlay.addColorStop(1, 'rgba(0,25,41,.96)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, PAGE.width, 610);

  ctx.fillStyle = COLORS.goldLight;
  ctx.font = '700 34px Georgia, serif';
  ctx.fillText('AMY BLANDÓN', 70, 76);
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.font = '500 17px Arial, sans-serif';
  ctx.fillText('ASESORA INMOBILIARIA | SEGUROS | INVERSIONES', 72, 107);

  fillRoundedRect(ctx, 918, 48, 250, 62, 31, 'rgba(0,25,41,.82)');
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

  fillRoundedRect(ctx, 70, 330, 170, 42, 21, COLORS.gold);
  ctx.fillStyle = COLORS.navy;
  ctx.font = '800 15px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(operationLabel.toUpperCase(), 155, 357);
  ctx.textAlign = 'left';

  ctx.fillStyle = COLORS.white;
  ctx.font = '800 50px Arial, sans-serif';
  const titleLines = wrapLines(ctx, property.title || 'Propiedad', 850, 2);
  drawLines(ctx, titleLines, 70, 423, 58, COLORS.white);

  const titleBottom = 423 + ((titleLines.length - 1) * 58);
  ctx.fillStyle = 'rgba(255,255,255,.86)';
  ctx.font = '500 20px Arial, sans-serif';
  ctx.fillText(`${typeLabel} · ${location}`, 72, titleBottom + 48);

  ctx.fillStyle = COLORS.goldLight;
  ctx.font = '800 34px Arial, sans-serif';
  ctx.fillText(price, 72, titleBottom + 95);

  if (property.internalCode) {
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,.76)';
    ctx.font = '600 15px Arial, sans-serif';
    ctx.fillText(`CÓDIGO ${cleanText(property.internalCode).toUpperCase()}`, 1168, titleBottom + 93);
    ctx.textAlign = 'left';
  }

  const facts = buildFacts(property);
  const metricsY = 650;
  const metricsX = 70;
  const metricsWidth = 1100;
  const gap = 14;
  const count = Math.max(facts.length, 1);
  const metricWidth = (metricsWidth - (gap * (count - 1))) / count;

  if (facts.length) {
    facts.forEach((fact, index) => {
      const x = metricsX + (index * (metricWidth + gap));
      fillRoundedRect(ctx, x, metricsY, metricWidth, 128, 18, COLORS.white);
      strokeRoundedRect(ctx, x, metricsY, metricWidth, 128, 18, COLORS.border, 1.5);
      drawMetricIcon(ctx, fact.key, x + 18, metricsY + 36, 56);
      ctx.fillStyle = COLORS.muted;
      ctx.font = '700 13px Arial, sans-serif';
      ctx.fillText(fact.label.toUpperCase(), x + 88, metricsY + 48);
      ctx.fillStyle = COLORS.text;
      ctx.font = '800 23px Arial, sans-serif';
      const metricLines = wrapLines(ctx, fact.value, metricWidth - 108, 2);
      drawLines(ctx, metricLines, x + 88, metricsY + 78, 25, COLORS.text);
    });
  } else {
    fillRoundedRect(ctx, metricsX, metricsY, metricsWidth, 128, 18, COLORS.white);
    strokeRoundedRect(ctx, metricsX, metricsY, metricsWidth, 128, 18, COLORS.border, 1.5);
    ctx.fillStyle = COLORS.muted;
    ctx.font = '600 18px Arial, sans-serif';
    ctx.fillText('Los datos técnicos se completan según la información disponible de la propiedad.', 100, metricsY + 72);
  }

  const descriptionY = 830;
  ctx.fillStyle = COLORS.gold;
  ctx.font = '800 14px Arial, sans-serif';
  ctx.fillText('PRESENTACIÓN DE LA PROPIEDAD', 70, descriptionY);
  ctx.fillStyle = COLORS.text;
  ctx.font = '800 31px Arial, sans-serif';
  ctx.fillText('Descripción', 70, descriptionY + 48);
  ctx.fillStyle = COLORS.muted;
  ctx.font = '500 19px Arial, sans-serif';
  const descriptionLines = wrapLines(ctx, property.description || 'Información descriptiva pendiente.', 1100, 5);
  drawLines(ctx, descriptionLines, 70, descriptionY + 91, 31, COLORS.muted);

  const sectionY = 1100;
  const columnWidth = 532;
  const columnGap = 36;
  const amenities = [...asList(property.features), ...asList(property.services), ...asList(property.amenities)]
    .filter((item, index, values) => values.indexOf(item) === index)
    .slice(0, 6);
  const details = buildDynamicDetails(property);

  fillRoundedRect(ctx, 70, sectionY, columnWidth, 300, 20, COLORS.white);
  strokeRoundedRect(ctx, 70, sectionY, columnWidth, 300, 20, COLORS.border, 1.5);
  ctx.fillStyle = COLORS.navy;
  ctx.font = '800 24px Arial, sans-serif';
  ctx.fillText('Características', 100, sectionY + 48);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(100, sectionY + 66, 70, 4);
  ctx.font = '600 17px Arial, sans-serif';
  const featureItems = amenities.length ? amenities : ['Información disponible bajo consulta'];
  featureItems.forEach((item, index) => {
    const y = sectionY + 112 + (index * 31);
    ctx.fillStyle = COLORS.gold;
    ctx.beginPath(); ctx.arc(108, y - 5, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = COLORS.text;
    ctx.fillText(cleanText(item).slice(0, 44), 127, y);
  });

  const detailsX = 70 + columnWidth + columnGap;
  fillRoundedRect(ctx, detailsX, sectionY, columnWidth, 300, 20, COLORS.navy);
  strokeRoundedRect(ctx, detailsX, sectionY, columnWidth, 300, 20, COLORS.gold, 1.5);
  ctx.fillStyle = COLORS.goldLight;
  ctx.font = '800 24px Arial, sans-serif';
  ctx.fillText('Información clave', detailsX + 30, sectionY + 48);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(detailsX + 30, sectionY + 66, 70, 4);
  ctx.font = '600 16px Arial, sans-serif';
  const detailItems = details.length ? details : [
    { label: 'Tipo', value: typeLabel },
    { label: 'Operación', value: operationLabel },
    { label: 'Ubicación', value: location },
  ];
  detailItems.slice(0, 5).forEach((item, index) => {
    const y = sectionY + 111 + (index * 38);
    ctx.fillStyle = 'rgba(255,255,255,.62)';
    ctx.fillText(`${cleanText(item.label).toUpperCase()}:`, detailsX + 30, y);
    ctx.fillStyle = COLORS.white;
    const value = cleanText(item.value).slice(0, 36);
    ctx.fillText(value, detailsX + 188, y);
  });

  const contactY = 1440;
  ctx.fillStyle = COLORS.navy;
  ctx.fillRect(0, contactY, PAGE.width, PAGE.height - contactY);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(0, contactY, PAGE.width, 6);

  fillRoundedRect(ctx, 70, contactY + 48, 92, 92, 20, COLORS.gold);
  ctx.fillStyle = COLORS.navy;
  ctx.textAlign = 'center';
  ctx.font = '800 34px Georgia, serif';
  ctx.fillText('AB', 116, contactY + 106);
  ctx.textAlign = 'left';

  ctx.fillStyle = COLORS.white;
  ctx.font = '800 30px Arial, sans-serif';
  ctx.fillText('Amy Blandón', 190, contactY + 78);
  ctx.fillStyle = COLORS.goldLight;
  ctx.font = '700 15px Arial, sans-serif';
  ctx.fillText('ASESORÍA INMOBILIARIA · SEGUROS · INVERSIONES', 190, contactY + 111);

  ctx.fillStyle = 'rgba(255,255,255,.78)';
  ctx.font = '600 17px Arial, sans-serif';
  ctx.fillText(amyContact.phone, 70, contactY + 190);
  ctx.fillText(amyContact.email, 315, contactY + 190);
  ctx.fillText(amyContact.location, 650, contactY + 190);

  ctx.textAlign = 'right';
  ctx.fillStyle = COLORS.goldLight;
  ctx.font = '700 17px Arial, sans-serif';
  ctx.fillText('amyblandon.com', 1170, contactY + 190);
  ctx.textAlign = 'left';

  ctx.fillStyle = 'rgba(255,255,255,.38)';
  ctx.font = '500 12px Arial, sans-serif';
  ctx.fillText('Ficha comercial informativa · Datos sujetos a verificación y disponibilidad.', 70, PAGE.height - 42);
  ctx.textAlign = 'right';
  ctx.fillText(`Generada ${new Date().toLocaleDateString('es-NI')}`, 1170, PAGE.height - 42);
  ctx.textAlign = 'left';

  const pdfBlob = await singlePagePdfFromCanvas(canvas);
  const objectUrl = URL.createObjectURL(pdfBlob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = `ficha-tecnica-${safeFileName(property.slug || property.title)}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
}
