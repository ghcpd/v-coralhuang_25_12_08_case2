SriMaata — Lightweight Prenatal Care Website

Quick start (requires Docker):

1. Copy `.env.example` to `.env` and edit if needed.
2. Run `docker-compose up --build` to start the web app and Postgres.
3. Open http://localhost:3000

API Endpoints:
- `GET /api/appointments` — list appointments
- `POST /api/appointments` — create appointment (body: name,email,phone,service,datetime,notes)
- `POST /api/create-order` — create Razorpay order (requires keys)

Razorpay:
To enable payments set `RAZORPAY_KEY` and `RAZORPAY_SECRET` in the environment (or in `docker-compose.yml`). The project includes a simple order creation endpoint.

Notes:
- Lightweight static frontend in `public/`.
- Database in Postgres service; data persists in Docker volume.
