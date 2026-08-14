const ALLOWED_HOSTS = new Set([
  'firebasestorage.googleapis.com',
  'storage.googleapis.com',
  'amyblandon.firebasestorage.app',
]);

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Método no permitido' });
  }

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  let rawUrl = '';
  try {
    const host = request.headers?.host || 'amyblandon.vercel.app';
    const requestUrl = new URL(request.url || '/', `https://${host}`);
    rawUrl = requestUrl.searchParams.get('url') || '';
  } catch {
    rawUrl = '';
  }

  if (!rawUrl) {
    const queryValue = Array.isArray(request.query?.url) ? request.query.url[0] : request.query?.url;
    rawUrl = queryValue || '';
  }

  if (!rawUrl) return response.status(400).json({ error: 'Falta la URL de imagen' });

  let target;
  try {
    target = new URL(rawUrl);
  } catch {
    return response.status(400).json({ error: 'URL inválida' });
  }

  if (target.protocol !== 'https:' || !ALLOWED_HOSTS.has(target.hostname)) {
    return response.status(403).json({ error: 'Origen de imagen no permitido' });
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        'User-Agent': 'AmyBlandon-PropertySheet/1.0',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!upstream.ok) return response.status(upstream.status).end();

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) return response.status(415).json({ error: 'El recurso no es una imagen' });

    const bytes = Buffer.from(await upstream.arrayBuffer());
    response.setHeader('Content-Type', contentType);
    response.setHeader('Content-Length', String(bytes.length));
    response.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    return response.status(200).send(bytes);
  } catch {
    return response.status(502).json({ error: 'No se pudo cargar la imagen' });
  }
}
