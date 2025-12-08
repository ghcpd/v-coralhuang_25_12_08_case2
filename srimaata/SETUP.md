# 🌿 SriMaata - Quick Start Guide

## What You're Getting

A complete, production-ready prenatal care web application with:
- ✅ User authentication (register/login)
- ✅ Service browsing and booking
- ✅ Appointment management
- ✅ Razorpay payment integration
- ✅ MongoDB database
- ✅ Responsive UI
- ✅ Docker containerization
- ✅ Email notifications

## File Structure

```
srimaata/
├── backend/
│   ├── models/              # Database schemas
│   │   ├── User.js
│   │   ├── Appointment.js
│   │   ├── Service.js
│   │   └── Contact.js
│   ├── routes/              # API endpoints
│   │   ├── auth.js          # Login/signup
│   │   ├── appointments.js  # Booking management
│   │   ├── services.js      # Service listing
│   │   ├── payments.js      # Razorpay integration
│   │   └── contact.js       # Contact form
│   ├── server.js            # Express server
│   └── seed.js              # Database seeding
├── frontend/
│   ├── public/
│   │   └── index.html       # Main page (Home, About, Services, Contact)
│   ├── css/
│   │   └── style.css        # Responsive styling
│   └── js/
│       └── main.js          # Frontend logic & API calls
├── Dockerfile               # Container configuration
├── docker-compose.yml       # Multi-container orchestration
├── package.json             # Dependencies
├── .env                     # Environment variables
├── .env.example             # Example env file
├── README.md                # Full documentation
└── SETUP.md                 # This file
```

## Installation & Setup

### Option 1: Docker Compose (Recommended)

**Fastest setup - everything runs in containers**

```bash
# 1. Navigate to srimaata directory
cd srimaata

# 2. Build and start all services
docker-compose up --build

# 3. Wait for all services to start (~30 seconds)
# You'll see: "🌿 SriMaata server running on port 5000"
```

That's it! Access the app at:
- **Frontend:** http://localhost:3000 (if using separate web server)
- **Backend API:** http://localhost:5000/api/health

To stop:
```bash
docker-compose down
```

### Option 2: Local Development

**Run on your machine for development**

#### Prerequisites
- Node.js 18+ installed
- MongoDB running (locally or Docker)

#### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start MongoDB (if using Docker)
docker run -d -p 27017:27017 mongo:6.0-alpine

# 3. Configure environment
# Edit .env file with your settings (Razorpay keys, email, etc.)

# 4. Start backend (development mode with auto-reload)
npm run dev
# Backend runs at http://localhost:5000

# 5. In another terminal, serve frontend
npx http-server frontend/public -p 3000
# Frontend runs at http://localhost:3000
```

## Configuration

### Essential Setup

Edit `.env` file and update:

```env
# 1. Razorpay (for payments)
RAZORPAY_KEY_ID=your_test_key_from_razorpay
RAZORPAY_KEY_SECRET=your_test_secret_from_razorpay

# 2. Email notifications (Gmail)
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
# See: https://support.google.com/accounts/answer/185833

# 3. JWT Secret (keep secure)
JWT_SECRET=your_super_secret_key_here

# 4. Database
MONGODB_URI=mongodb://localhost:27017/srimaata
```

### Getting Razorpay Keys

1. Sign up at https://razorpay.com
2. Go to Settings → API Keys
3. Copy Test Key ID and Secret
4. Paste into `.env`

### Gmail App Password

1. Enable 2-factor authentication on Gmail account
2. Go to myaccount.google.com/apppasswords
3. Generate app password for Mail
4. Use this as `SMTP_PASSWORD` in `.env`

## Usage

### User Registration & Login
1. Click "Login" in navigation
2. Click "Sign Up" to create new account
3. Fill in name, email, password
4. Click "Create Account"

### Booking an Appointment
1. Browse services on homepage
2. Click "Book Now" on any service
3. Select date and time
4. Proceed to payment
5. Complete Razorpay payment
6. Appointment confirmed!

### Contact Form
1. Scroll to "Contact" section
2. Fill in your details and message
3. We'll receive your message and respond

### View Appointments (After Login)
1. Click "My Account" in navigation
2. See all your booked appointments
3. Manage or cancel as needed

## Services & Pricing

### For Couples Planning Pregnancy
- Sacred Beginnings: Before Conception - ₹2,999
- Shareera Shuddhi – Cleansing & Nourishment - ₹3,499
- Garbhadhana Samskara – The Sacred Act - ₹2,499

### For Mothers During Pregnancy
- Garbha Samskara Sessions - ₹1,999
- Antenatal Group Classes - ₹4,999
- One-on-One Consultation - ₹2,499

### Postnatal Care
- Postnatal Recovery & Rejuvenation - ₹3,999
- Mother-Baby Bonding Sessions - ₹2,999
- Lactation & Wellness Support - ₹1,999

## API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile (requires token)
PUT /api/auth/profile (requires token)
```

### Appointments
```
POST /api/appointments (requires token)
GET /api/appointments (requires token)
GET /api/appointments/:id (requires token)
PUT /api/appointments/:id (requires token)
DELETE /api/appointments/:id (requires token)
```

### Services
```
GET /api/services
GET /api/services/category/:category
```

### Payments
```
POST /api/payments/create-order (requires token)
POST /api/payments/verify-payment (requires token)
```

### Contact
```
POST /api/contact
```

## Troubleshooting

### Problem: "Cannot connect to MongoDB"
```bash
# Solution: Make sure MongoDB is running
docker-compose logs mongodb
```

### Problem: "Port 5000 already in use"
```bash
# Solution: Use different port
export PORT=5001
npm run dev
```

### Problem: "Razorpay payment not working"
- Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in `.env`
- Use test credentials (starts with `rzp_test_`)
- For production, use live credentials

### Problem: "Emails not sending"
- Verify SMTP_EMAIL and SMTP_PASSWORD in `.env`
- For Gmail, use app password (not your password)
- Enable "Less secure app access" if needed

### Problem: Frontend can't reach backend API
- Check CORS settings in `backend/server.js`
- Ensure backend is running on correct port
- Update API_URL in `frontend/js/main.js` if needed

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  pregnancyStage: String,
  createdAt: Date
}
```

### Appointment
```javascript
{
  userId: ObjectId,
  serviceName: String,
  appointmentDate: Date,
  appointmentTime: String,
  status: String (pending/confirmed/completed/cancelled),
  paymentStatus: String (pending/completed/failed),
  razorpayOrderId: String,
  razorpayPaymentId: String,
  notes: String,
  createdAt: Date
}
```

### Service
```javascript
{
  name: String,
  category: String (before-conception/pregnancy/postnatal),
  description: String,
  price: Number,
  duration: Number (in minutes),
  createdAt: Date
}
```

### Contact
```javascript
{
  name: String,
  email: String,
  message: String,
  status: String (new/responded/resolved),
  createdAt: Date
}
```

## Deployment Options

### Heroku
1. Create `Procfile`: `web: npm start`
2. Add MongoDB Atlas connection
3. Set environment variables
4. Deploy with git push

### AWS (EC2 + RDS)
1. Launch EC2 instance
2. Install Node.js and PM2
3. Clone repository
4. Use RDS for MongoDB alternative
5. Run `npm start` with PM2

### DigitalOcean App Platform
1. Connect GitHub repository
2. Configure build and run commands
3. Add environment variables
4. Deploy automatically

### Docker (Any Host)
```bash
docker build -t srimaata .
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://host:27017/srimaata \
  -e RAZORPAY_KEY_ID=your_key \
  -e RAZORPAY_KEY_SECRET=your_secret \
  srimaata
```

## Performance Tips

✅ **Already Optimized:**
- Lightweight dependencies
- Minimal CSS (~15KB)
- Efficient API routes
- Database indexing
- JWT token-based auth

✅ **For Production:**
- Enable gzip compression
- Use CDN for static assets
- Implement rate limiting
- Add caching headers
- Monitor error logs

## Support Contact

📞 **Phone:** +91 94822 90747
📧 **Email:** Srimaata.care@gmail.com
📍 **Address:** Ashwini Ayurveda, Bharati Street, Sringeri 577139

## Features Summary

| Feature | Status |
|---------|--------|
| User Authentication | ✅ Complete |
| Service Booking | ✅ Complete |
| Appointment Management | ✅ Complete |
| Payment Processing | ✅ Razorpay Integrated |
| Database | ✅ MongoDB |
| Email Notifications | ✅ Setup-Ready |
| Responsive Design | ✅ Mobile-Friendly |
| Containerization | ✅ Docker Ready |
| Admin Features | 🔄 Planned |
| Video Consultation | 🔄 Planned |

## License

MIT - Feel free to use and modify

---

**Nurturing Life Through Ancient Wisdom** 🌿

Built with ❤️ for SriMaata
