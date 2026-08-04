# Amy Blandon Professional Platform

A new, original bilingual web platform for Amy Blandon, prepared for real estate listings, insurance advisory requests, resources, lead capture, Firebase administration, and Vercel deployment. The current domain is intentionally not connected.

## Technologies
React, Vite, modern JavaScript, React Router DOM, Firebase Authentication, Cloud Firestore, Firebase Storage, Leaflet/OpenStreetMap, Lucide React, React Hook Form, Zod, modular CSS, and Vercel SPA routing.

## Install and run
```bash
npm install
npm run dev
npm run lint
npm run build
```

## Environment variables
Copy `.env.example` to `.env.local` and fill Firebase values only when the Firebase project is ready.

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_EMAILS=
VITE_DEFAULT_LANGUAGE=en
```

## Firebase setup
The app automatically uses local demonstration data when Firebase variables are empty. When credentials exist, services in `src/services` use Firestore and Storage-ready paths.

Initial collections:
- `users`
- `properties`
- `realEstateLeads`
- `insuranceRequests`
- `contacts`
- `appointments`
- `testimonials`
- `articles`
- `siteSettings`

Security files are included: `firestore.rules`, `storage.rules`, and `firestore.indexes.json`. Admin access requires a `users/{uid}.role == "admin"` document or an email in `VITE_ADMIN_EMAILS` as bootstrap fallback.

## Folder structure
The project follows a scalable structure under `src/` with separate folders for assets, reusable components, config, contexts, data, hooks, layouts, pages, routes, services, styles, utils, and Firebase initialization.

## Demonstration content
Demo properties, articles, testimonials, statistics, and contact information are original placeholders. They are clearly labeled and must be replaced with approved Amy Blandon assets, verified professional details, real listings, legal notices, insurance disclosures, and testimonials before launch.

## Vercel deployment
`vercel.json` rewrites all routes to `index.html` so internal SPA pages refresh correctly. Do not add `amyblandon.com` until the platform content, Firebase project, legal disclosures, and production review are complete.
