# SecondServe AI

A cinematic, local food-rescue platform for posting surplus food, reserving available portions, and recording completed handoffs. The interface starts with explicitly labelled local demonstration data; it is not a live marketplace until connected to a deployment, real users, and real data.

## Run locally

1. Install Node.js 18 or newer.
2. From this folder, optionally copy `.env.example` to `.env` and fill in the Cloudinary variables if image uploads are needed.
3. Start the server:

   ```powershell
   node server.js
   ```

4. Open [http://localhost:3000](http://localhost:3000).

If npm is available, `npm run dev` and `npm test` are equivalent convenience commands.

## Main routes

- `/` — cinematic landing page, availability preview, and impact summary.
- `/find` — live local listing search and filters.
- `/offer` — two-step donation form with optional image upload.
- `/listing/:id` — reservation details and handoff completion.
- `/donor` — operational donor view.
- `/impact` — transparent impact metrics and method notes.

## Data integrity

- The server owns listing data in `data/listings.json`, creating it from a small sample dataset on the first API request.
- Reservations are created only when sufficient portions remain. A server-side recheck prevents over-reservation.
- Only an active reservation can be completed or released; a completed reservation cannot be transitioned a second time.
- Completed portions are used for the displayed handoff metric. No carbon, financial, or beneficiaries-served claims are calculated.

## Cloudinary image uploads

This is an optional, real server-side integration. Add the following server environment variables:

```text
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

The browser sends an image only to this application. The server validates JPG, PNG, and WebP data up to 6 MB, makes a short-lived SHA-1 signed Cloudinary upload request, and returns the optimized secure URL. `CLOUDINARY_API_SECRET` is never delivered to browser JavaScript. If configuration is absent or Cloudinary rejects an upload, the form explains the failure and does not falsely mark the image as uploaded.

Cloudinary delivery URLs are transformed for responsive `f_auto`, `q_auto`, and width-based output when the image is rendered.

## Verification

```powershell
node --check server.js
node --check public/app.js
node --test tests/api.test.js
```

The test suite verifies creation validation, portion limits, reservation completion, and prevention of a repeated status transition.
