SriMaata — Lightweight prenatal care web app

Quick start

1) Install dependencies
   npm install

2) Run locally
   npm run dev

3) Build and run in Docker
   docker build -t srimaata .
   docker run -p 3000:3000 -v ${PWD}/data:/app/data srimaata

API

- GET /api/appointments
- POST /api/appointments { name, email, phone, date, time, notes }
- POST /api/pay (stub - add Razorpay server-side order creation)

Notes

- Razorpay integration is stubbed; replace /api/pay with real order creation using your API keys for production. A typical flow:
  1) Create order server-side using Razorpay Node SDK with your key/secret
  2) Return order id to client
  3) Perform client-side checkout and verify payment signature server-side

- Uses a simple JSON file (data/appointments.json) as a lightweight database to keep the project container-friendly.
- Admin: visit /admin.html to view current appointments.
