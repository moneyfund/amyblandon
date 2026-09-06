const FALLBACK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="24" fill="#001929"/>
  <rect x="5" y="5" width="118" height="118" rx="20" fill="none" stroke="#C99A44" stroke-width="5"/>
  <text x="64" y="78" text-anchor="middle" fill="#E2BE73" font-family="Georgia, 'Times New Roman', serif" font-size="49" font-weight="700">AB</text>
</svg>`;

function extractFaviconBase64(html) {
  const iconTag = html.match(/<link\b[^>]*\brel=["'][^"']*\bicon\b[^"']*["'][^>]*>/i)?.[0]
    || html.match(/<link\b[^>]*\brel=["']shortcut icon["'][^>]*>/i)?.[0];
  if (!iconTag) return '';

  return iconTag.match(/\bhref=["']data:image\/png;base64,([^"']+)["']/i)?.[1] || '';
}

export default async function handler(_req, res) {
  try {
    const response = await fetch('https://www.amyblandon.com/', {
      headers: { 'User-Agent': 'amyblandon-favicon-service/1.0' },
    });

    if (!response.ok) throw new Error(`No se pudo obtener el favicon (${response.status})`);

    const html = await response.text();
    const base64 = extractFaviconBase64(html);
    if (!base64) throw new Error('No se encontró el favicon PNG activo');

    const image = Buffer.from(base64, 'base64');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    res.status(200).send(image);
  } catch (error) {
    console.error('No se pudo servir el favicon activo para la ficha técnica:', error);
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    res.status(200).send(FALLBACK_SVG.trim());
  }
}
