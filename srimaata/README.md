# SriMaata - Prenatal Care Web Application

A lightweight, containerizable web application for prenatal care guidance rooted in Ayurvedic wisdom.

## Features

✨ **Core Features:**
- User authentication (Login/Signup)
- Service browsing and appointment booking
- Razorpay payment integration
- MongoDB database for appointments and user data
- Responsive design
- Contact form with email notifications
- User account management

## Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB
- JWT Authentication
- Razorpay Payment API
- Nodemailer for email notifications

**Frontend:**
- HTML5
- CSS3 (responsive design)
- Vanilla JavaScript
- Razorpay Checkout

**DevOps:**
- Docker
- Docker Compose

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB (or use Docker image)

### Local Development Setup

1. **Clone and Install**
```bash
cd srimaata
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your credentials:
# - RAZORPAY_KEY_ID
# - RAZORPAY_KEY_SECRET
# - SMTP credentials
```

3. **Start Backend**
```bash
npm run dev
# Server runs on http://localhost:5000
```

4. **Serve Frontend**
Open `frontend/public/index.html` in your browser or use:
```bash
npx http-server frontend/public
# Runs on http://localhost:8080
```

### Docker Deployment

1. **Build and Run**
```bash
docker-compose up --build
```

2. **Access Application**
- Backend API: http://localhost:5000
- Frontend: http://localhost:3000

3. **Database**
- MongoDB runs on port 27017
- Data persisted in `mongodb_data` volume

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get user's appointments
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Services
- `GET /api/services` - Get all services
- `GET /api/services/category/:category` - Get services by category

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify-payment` - Verify payment

### Contact
- `POST /api/contact` - Submit contact form

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/srimaata
JWT_SECRET=your_jwt_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
```

## Project Structure

```
srimaata/
├── backend/
│   ├── models/           # MongoDB schemas
│   │   ├── User.js
│   │   ├── Appointment.js
│   │   ├── Service.js
│   │   └── Contact.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── appointments.js
│   │   ├── services.js
│   │   ├── payments.js
│   │   └── contact.js
│   └── server.js         # Express server
├── frontend/
│   ├── public/
│   │   └── index.html    # Main HTML
│   ├── css/
│   │   └── style.css     # Styling
│   └── js/
│       └── main.js       # JavaScript logic
├── Dockerfile            # Container config
├── docker-compose.yml    # Multi-container setup
├── package.json          # Dependencies
└── README.md            # This file
```

## Services Offered

### For Couples Planning Pregnancy
- Sacred Beginnings: Before Conception
- Shareera Shuddhi – Cleansing & Nourishment
- Garbhadhana Samskara – The Sacred Act

### For Mothers During Pregnancy
- Garbha Samskara Sessions
- Antenatal Group Classes
- One-on-One Consultation

### Postnatal Care
- Postnatal Recovery & Rejuvenation
- Mother-Baby Bonding Sessions
- Lactation & Wellness Support

## Pricing

Services range from ₹1,999 to ₹4,999 per session, with flexible booking options.

## Payment Processing

Razorpay integration enables secure payment processing:
- Multiple payment methods supported
- Automatic order creation and verification
- Secure signature validation

## Database Models

### User
- name, email, password (hashed)
- phone, pregnancy stage
- timestamps

### Appointment
- userId reference
- serviceName, date, time
- status, payment status
- Razorpay transaction IDs

### Service
- name, category, description
- price, duration
- timestamps

### Contact
- name, email, message
- status (new/responded/resolved)
- timestamps

## Performance & Optimization

✅ **Lightweight:**
- Minimal dependencies
- Optimized CSS
- Efficient API endpoints
- Responsive images

✅ **Containerizable:**
- Alpine Linux base (18MB)
- Multi-stage builds
- Health checks
- Volume persistence

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Input validation
- Secure payment verification

## Troubleshooting

### MongoDB Connection Error
```bash
# Ensure MongoDB is running
docker-compose up mongodb -d
```

### Payment Gateway Not Working
- Verify Razorpay credentials in .env
- Check API keys are correct
- Ensure HTTPS for production

### CORS Issues
- Backend CORS is configured
- Update FRONTEND_URL in .env if needed

## Future Enhancements

- Admin dashboard
- Appointment reminders (SMS/Email)
- Video consultation integration
- Ayurvedic resource library
- Progress tracking
- Testimonials section
- Blog/Articles

## Support

For support, contact: **Srimaata.care@gmail.com**
Phone: **+91 94822 90747**

## License

MIT License - See LICENSE file for details

---

**Nurturing Life Through Ancient Wisdom** 🌿

SriMaata - Prenatal Care Rooted in Ayurvedic Tradition
