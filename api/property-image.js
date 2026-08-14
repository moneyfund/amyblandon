const ALLOWED_HOSTS = new Set([
  'firebasestorage.googleapis.com',
  'storage.googleapis.com',
]);

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Método no permitido' });
  }

  const rawUrl = Array.isArray(request.query?.url) ? request.query.url[0] : request.query?.url;
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
    const upstream = await fetch(target.toString());
    if (!upstream.ok) return response.status(upstream.status).end();

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) return response.status(415).end();

    const bytes = Buffer.from(await upstream.arrayBuffer());
    response.setHeader('Content-Type', contentType);
    response.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    return response.status(200).send(bytes);
  } catch {
    return response.status(502).json({ error: 'No se pudo cargar la imagen' });
  }
}
