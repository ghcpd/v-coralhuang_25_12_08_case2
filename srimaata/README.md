Srimaata - lightweight prenatal care web app

Overview
- Node.js + Express backend
- SQLite database for appointments
- Simple static frontend (HTML/CSS/vanilla JS)
- Razorpay order creation API (optional, uses env vars)
- Dockerfile + docker-compose for containerization

Quick start
1. Copy .env.example -> .env and set RAZORPAY keys if you want payments.
2. npm install
3. npm run dev (or npm start)
4. Open http://localhost:3000

Docker
- docker build -t srimaata .
- docker run -p 3000:3000 --env-file .env -v ${PWD}/data:/app/data srimaata

Notes
- The Razorpay integration requires keys set in .env; without it the endpoint will report a clear error.
- Images are linked from Unsplash for a lightweight build. Replace with local assets if desired.

License: MIT
