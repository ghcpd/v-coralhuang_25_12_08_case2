# Srimaata — Lightweight prenatal care web app

This repository contains a minimal, containerizable web app for a prenatal care service called Srimaata. It provides a static frontend, an Express API, and a simple appointments database. The app can use either SQLite by default or Postgres when a DATABASE_URL is provided.

Features
- Landing page (Home, About, Services, Contact)
- Book an appointment form (stored in DB)
- Optional Razorpay payment integration (server + client support; keys required)
- Containerizable with Docker + docker-compose (Postgres service included)

Quick start (local)

1. Install:

```powershell
npm install
```

2. Start in dev:

```powershell
npm run dev
```

3. Open http://localhost:3000

Using Postgres via docker-compose

1. Start services (this creates a Postgres DB and starts the app):

```powershell
docker compose up --build
```

2. If you want the app to use the Postgres DB, set DATABASE_URL to:

postgresql://postgres:example@db:5432/srimaata

Add Razorpay (payments)

Set RZP_KEY_ID and RZP_KEY_SECRET in environment (or in the compose file) to enable payments. The frontend will detect a public key and load checkout if provided.

Notes
- Data stored in `data/srimaata.sqlite` when using the default SQLite mode. Do NOT commit the `data/` folder.
- This is a minimal demo — in a real app you would add authentication, validation, rate limiting, and stronger input sanitisation.
