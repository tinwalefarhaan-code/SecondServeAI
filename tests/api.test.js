import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import test from 'node:test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../server.js';

async function startTestApp() {
  const directory = await mkdtemp(join(tmpdir(), 'secondserve-'));
  const server = createApp({ dataPath: join(directory, 'listings.json') });
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  return { base: `http://127.0.0.1:${port}`, close: async () => { await new Promise((resolve) => server.close(resolve)); await rm(directory, { recursive: true, force: true }); } };
}

test('a reservation cannot exceed the available portions and can be completed once', async () => {
  const app = await startTestApp();
  try {
    const listings = await (await fetch(`${app.base}/api/listings`)).json();
    const listing = listings.listings.find((item) => item.availablePortions > 2);
    const reserved = await fetch(`${app.base}/api/listings/${listing.id}/reservations`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ organization: 'Test Kitchen', quantity: 2 }) });
    assert.equal(reserved.status, 201);
    const reservationPayload = await reserved.json();
    assert.equal(reservationPayload.listing.availablePortions, listing.availablePortions - 2);

    const tooMany = await fetch(`${app.base}/api/listings/${listing.id}/reservations`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ organization: 'Test Kitchen', quantity: 10000 }) });
    assert.equal(tooMany.status, 409);

    const completed = await fetch(`${app.base}/api/reservations/${reservationPayload.reservation.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: 'completed' }) });
    assert.equal(completed.status, 200);
    const completionPayload = await completed.json();
    assert.equal(completionPayload.reservation.status, 'completed');
    assert.equal(completionPayload.listing.collectedPortions, 2);

    const repeated = await fetch(`${app.base}/api/reservations/${reservationPayload.reservation.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: 'completed' }) });
    assert.equal(repeated.status, 409);
  } finally { await app.close(); }
});

test('listing creation validates required handoff details', async () => {
  const app = await startTestApp();
  try {
    const invalid = await fetch(`${app.base}/api/listings`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ foodName: 'Bread' }) });
    assert.equal(invalid.status, 422);
    const valid = await fetch(`${app.base}/api/listings`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ foodName: 'Test soup', category: 'Prepared meals', totalPortions: 8, donor: 'Test Café', location: 'Test area', pickupWindow: 'Today 18:00–19:00' }) });
    assert.equal(valid.status, 201);
    const payload = await valid.json();
    assert.equal(payload.listing.availablePortions, 8);
  } finally { await app.close(); }
});
