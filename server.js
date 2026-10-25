import { createHash, randomUUID } from 'node:crypto';
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const publicDir = join(root, 'public');
const defaultDataPath = join(root, 'data', 'listings.json');
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const remoteFoodImage = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;

// Keep credentials out of the browser while making the documented local .env setup work
// without adding a runtime dependency. Existing process environment values always win.
function loadDotEnv(source) {
  for (const rawLine of source.split(/\r?\n/)) {
    const match = rawLine.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || process.env[match[1]]) continue;
    const value = match[2].replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, (_, doubleQuoted, singleQuoted) => doubleQuoted ?? singleQuoted ?? '');
    process.env[match[1]] = value;
  }
}
try { loadDotEnv(await readFile(join(root, '.env'), 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const cloudinaryConfigured = () => Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

const seedListings = [
  {
    id: 'lst-market-vegetables', foodName: 'Market vegetable harvest', category: 'Produce',
    description: 'Crisp seasonal greens, tomatoes and root vegetables packed after today’s market.',
    totalPortions: 48, reservedPortions: 12, collectedPortions: 0, status: 'active',
    donor: 'Harbour & Field Market', location: 'Fort, Mumbai', pickupWindow: 'Today · 17:30–19:00',
    expiresAt: 'Today · best before 21:00', distance: '1.4 km', imageUrl: remoteFoodImage('photo-1542838132-92c53300491e'), createdAt: '2026-10-24T09:20:00.000Z',
    instructions: 'Use the east service entrance. Bring stackable crates.',
    reservations: [{ id: 'rsv-market-01', organization: 'Sankalp Community Kitchen', quantity: 12, status: 'reserved', createdAt: '2026-10-24T10:02:00.000Z' }]
  },
  {
    id: 'lst-bakery-bread', foodName: 'Sourdough & bakery selection', category: 'Bakery',
    description: 'Freshly baked loaves, croissants and rolls from the afternoon bake.',
    totalPortions: 36, reservedPortions: 0, collectedPortions: 0, status: 'active',
    donor: 'Morrow Bakehouse', location: 'Colaba, Mumbai', pickupWindow: 'Today · 18:00–20:30',
    expiresAt: 'Enjoy today or freeze on pickup', distance: '2.1 km', imageUrl: remoteFoodImage('photo-1509440159596-0249088772ff'), createdAt: '2026-10-24T11:10:00.000Z',
    instructions: 'Ask the counter team for the SecondServe order.', reservations: []
  },
  {
    id: 'lst-cafe-meals', foodName: 'Hearty café meal boxes', category: 'Prepared meals',
    description: 'Vegetarian lentil bowls with roasted vegetables, packed and chilled.',
    totalPortions: 24, reservedPortions: 24, collectedPortions: 0, status: 'active',
    donor: 'Good Day Café', location: 'Bandra West, Mumbai', pickupWindow: 'Tomorrow · 09:00–10:00',
    expiresAt: 'Tomorrow · consume by 14:00', distance: '4.8 km', imageUrl: remoteFoodImage('photo-1512621776951-a57141f2eefd'), createdAt: '2026-10-24T08:15:00.000Z',
    instructions: 'Collection is at the rear loading bay.',
    reservations: [{ id: 'rsv-cafe-01', organization: 'Asha Women’s Centre', quantity: 24, status: 'reserved', createdAt: '2026-10-24T09:05:00.000Z' }]
  },
  {
    id: 'lst-kitchen-fruit', foodName: 'Fruit & yoghurt breakfast packs', category: 'Pantry',
    description: 'Whole fruit and sealed yoghurt pots from a corporate kitchen service.',
    totalPortions: 30, reservedPortions: 0, collectedPortions: 30, status: 'active',
    donor: 'Common Table Kitchen', location: 'Lower Parel, Mumbai', pickupWindow: 'Completed',
    expiresAt: 'Handoff completed', distance: '3.2 km', imageUrl: remoteFoodImage('photo-1610832958506-aa56368176cf'), createdAt: '2026-10-23T08:15:00.000Z',
    instructions: '', reservations: [{ id: 'rsv-fruit-01', organization: 'Udaan Youth Collective', quantity: 30, status: 'completed', createdAt: '2026-10-23T09:00:00.000Z', completedAt: '2026-10-23T11:00:00.000Z' }]
  }
];

function cloneSeed() { return structuredClone(seedListings); }
function imageVariant(url, width = 900) {
  if (!url) return '';
  return url.includes('res.cloudinary.com') ? url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_fill/`) : url;
}
function decorate(listing) {
  const availablePortions = Math.max(0, listing.totalPortions - listing.reservedPortions - listing.collectedPortions);
  const fullyReserved = availablePortions === 0 && listing.reservedPortions > 0;
  const lifecycle = listing.status === 'cancelled' ? 'Cancelled' : listing.collectedPortions === listing.totalPortions ? 'Completed' : fullyReserved ? 'Reserved' : listing.reservedPortions ? 'Partially reserved' : 'Available';
  return { ...listing, availablePortions, lifecycle, imageUrl: imageVariant(listing.imageUrl) };
}
async function readListings(dataPath) {
  try { return JSON.parse(await readFile(dataPath, 'utf8')); }
  catch { const data = cloneSeed(); await saveListings(dataPath, data); return data; }
}
async function saveListings(dataPath, data) {
  await mkdir(join(dataPath, '..'), { recursive: true });
  await writeFile(dataPath, JSON.stringify(data, null, 2));
}
function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
}
function failure(res, status, message, code = 'REQUEST_FAILED') { json(res, status, { error: { code, message } }); }
async function body(req) {
  let raw = '';
  for await (const chunk of req) { raw += chunk; if (raw.length > 8_500_000) throw new Error('The request is too large.'); }
  try { return raw ? JSON.parse(raw) : {}; } catch { const err = new Error('Request body must be valid JSON.'); err.status = 400; throw err; }
}
function text(value, max = 240) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }
function quantity(value) { const n = Number(value); return Number.isInteger(n) && n > 0 && n <= 10000 ? n : null; }
function listingFor(data, id) { return data.find((item) => item.id === id); }
function requestPath(req) { return new URL(req.url, 'http://localhost').pathname; }
async function uploadToCloudinary({ dataUrl, filename }) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    const err = new Error('Image uploads are not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env, then restart the server.'); err.status = 503; err.code = 'CLOUDINARY_NOT_CONFIGURED'; throw err;
  }
  const matched = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || '');
  if (!matched || !IMAGE_TYPES.has(matched?.[1])) { const err = new Error('Upload a JPG, PNG, or WebP image.'); err.status = 400; throw err; }
  const bytes = Buffer.from(matched[2], 'base64');
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) { const err = new Error('Images must be smaller than 6 MB.'); err.status = 400; throw err; }
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'secondserve-ai';
  const signature = createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest('hex');
  const form = new FormData();
  form.append('file', new Blob([bytes], { type: matched[1] }), text(filename, 100) || 'food-rescue-upload');
  form.append('api_key', apiKey); form.append('timestamp', String(timestamp)); form.append('folder', folder); form.append('signature', signature);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, { method: 'POST', body: form });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.secure_url) { const err = new Error(payload.error?.message || 'Cloudinary could not upload this image.'); err.status = 502; err.code = 'CLOUDINARY_UPLOAD_FAILED'; throw err; }
  return { url: payload.secure_url, publicId: payload.public_id, width: payload.width, height: payload.height, format: payload.format };
}

export function createApp({ dataPath = defaultDataPath } = {}) {
  return createServer(async (req, res) => {
    try {
      const pathname = requestPath(req); const url = new URL(req.url, 'http://localhost');
      if (pathname === '/api/health') return json(res, 200, { ok: true, cloudinaryConfigured: cloudinaryConfigured() });
      if (pathname === '/api/listings' && req.method === 'GET') {
        const search = text(url.searchParams.get('search') || '').toLowerCase(); const category = text(url.searchParams.get('category') || ''); const state = text(url.searchParams.get('state') || '');
        let rows = (await readListings(dataPath)).map(decorate);
        if (search) rows = rows.filter((row) => `${row.foodName} ${row.description} ${row.donor}`.toLowerCase().includes(search));
        if (category && category !== 'All') rows = rows.filter((row) => row.category === category);
        if (state === 'available') rows = rows.filter((row) => row.availablePortions > 0 && row.status === 'active');
        if (state === 'completed') rows = rows.filter((row) => row.collectedPortions > 0);
        return json(res, 200, { listings: rows });
      }
      if (pathname === '/api/listings' && req.method === 'POST') {
        const payload = await body(req); const foodName = text(payload.foodName, 90); const portions = quantity(payload.totalPortions);
        if (!foodName || !portions || !text(payload.donor, 90) || !text(payload.location, 140) || !text(payload.pickupWindow, 120)) return failure(res, 422, 'Food name, donor, pickup location, pickup window, and a positive portion count are required.', 'VALIDATION_ERROR');
        const data = await readListings(dataPath); const now = new Date().toISOString();
        const item = { id: `lst-${randomUUID().slice(0, 8)}`, foodName, category: text(payload.category, 40) || 'Other', description: text(payload.description, 600), totalPortions: portions, reservedPortions: 0, collectedPortions: 0, status: 'active', donor: text(payload.donor, 90), location: text(payload.location, 140), pickupWindow: text(payload.pickupWindow, 120), expiresAt: text(payload.expiresAt, 120) || 'Confirm at pickup', distance: text(payload.distance, 30), imageUrl: text(payload.imageUrl, 1000), imagePublicId: text(payload.imagePublicId, 240), instructions: text(payload.instructions, 400), createdAt: now, reservations: [] };
        data.unshift(item); await saveListings(dataPath, data); return json(res, 201, { listing: decorate(item) });
      }
      const detailMatch = /^\/api\/listings\/([^/]+)$/.exec(pathname);
      if (detailMatch && req.method === 'GET') { const item = listingFor(await readListings(dataPath), detailMatch[1]); return item ? json(res, 200, { listing: decorate(item) }) : failure(res, 404, 'Listing not found.', 'NOT_FOUND'); }
      const reserveMatch = /^\/api\/listings\/([^/]+)\/reservations$/.exec(pathname);
      if (reserveMatch && req.method === 'POST') {
        const payload = await body(req); const org = text(payload.organization, 120); const portions = quantity(payload.quantity); const data = await readListings(dataPath); const item = listingFor(data, reserveMatch[1]);
        if (!item) return failure(res, 404, 'Listing not found.', 'NOT_FOUND'); if (item.status !== 'active') return failure(res, 409, 'This listing is no longer available for reservation.', 'INVALID_STATUS');
        const available = item.totalPortions - item.reservedPortions - item.collectedPortions;
        if (!org || !portions) return failure(res, 422, 'Your organization name and a valid quantity are required.', 'VALIDATION_ERROR');
        if (portions > available) return failure(res, 409, `Only ${available} portions remain.`, 'INSUFFICIENT_PORTIONS');
        const reservation = { id: `rsv-${randomUUID().slice(0, 8)}`, organization: org, quantity: portions, status: 'reserved', createdAt: new Date().toISOString() };
        item.reservations.push(reservation); item.reservedPortions += portions; await saveListings(dataPath, data); return json(res, 201, { reservation, listing: decorate(item) });
      }
      const reservationMatch = /^\/api\/reservations\/([^/]+)$/.exec(pathname);
      if (reservationMatch && req.method === 'PATCH') {
        const payload = await body(req); const newStatus = text(payload.status, 30); const data = await readListings(dataPath); let item; let reservation;
        for (const candidate of data) { const found = candidate.reservations.find((row) => row.id === reservationMatch[1]); if (found) { item = candidate; reservation = found; break; } }
        if (!reservation) return failure(res, 404, 'Reservation not found.', 'NOT_FOUND');
        if (reservation.status !== 'reserved' || !['completed', 'released'].includes(newStatus)) return failure(res, 409, 'Only an active reservation can be completed or released.', 'INVALID_TRANSITION');
        reservation.status = newStatus; reservation[`${newStatus}At`] = new Date().toISOString(); item.reservedPortions -= reservation.quantity; if (newStatus === 'completed') item.collectedPortions += reservation.quantity;
        await saveListings(dataPath, data); return json(res, 200, { reservation, listing: decorate(item) });
      }
      if (pathname === '/api/uploads' && req.method === 'POST') { const payload = await body(req); return json(res, 201, { image: await uploadToCloudinary({ dataUrl: payload.dataUrl, filename: payload.filename }) }); }
      if (pathname.startsWith('/api/')) return failure(res, 404, 'API endpoint not found.', 'NOT_FOUND');
      const requested = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, ''); const safePath = normalize(join(publicDir, requested));
      if (!safePath.startsWith(publicDir) || !existsSync(safePath)) { createReadStream(join(publicDir, 'index.html')).pipe(res); return; }
      const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
      res.writeHead(200, { 'Content-Type': types[extname(safePath)] || 'application/octet-stream' }); createReadStream(safePath).pipe(res);
    } catch (error) { failure(res, error.status || 500, error.message || 'Unexpected server error.', error.code || 'SERVER_ERROR'); }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 3000; const app = createApp();
  app.listen(port, () => console.log(`SecondServe AI is running at http://localhost:${port}`));
}
