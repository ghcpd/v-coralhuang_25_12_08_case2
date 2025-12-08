#!/bin/bash

# SriMaata Database Seeding Script
# Initializes MongoDB with sample data

mongosh mongodb://mongodb:27017/srimaata << EOF

// Clear existing data
db.users.deleteMany({})
db.services.deleteMany({})
db.appointments.deleteMany({})
db.contacts.deleteMany({})

// Insert sample services
db.services.insertMany([
  {
    name: "Sacred Beginnings: Before Conception",
    category: "before-conception",
    description: "Set a conscious intention for parenthood through guided reflections and partner alignment.",
    price: 2999,
    duration: 60
  },
  {
    name: "Shareera Shuddhi – Cleansing & Nourishment",
    category: "before-conception",
    description: "Prepare the body with Ayurvedic cleansing, balanced routines, and sattvic diet.",
    price: 3499,
    duration: 60
  },
  {
    name: "Garbhadhana Samskara – The Sacred Act",
    category: "before-conception",
    description: "Understand rituals and timing for sacred conception rooted in ancient wisdom.",
    price: 2499,
    duration: 45
  },
  {
    name: "Garbha Samskara Sessions",
    category: "pregnancy",
    description: "Lovingly guided sessions centered around the four pillars of conscious pregnancy.",
    price: 1999,
    duration: 60
  },
  {
    name: "Antenatal Group Classes",
    category: "pregnancy",
    description: "Join our group sessions designed to bring calm, clarity, and confidence to your motherhood journey.",
    price: 4999,
    duration: 90
  },
  {
    name: "One-on-One Consultation",
    category: "pregnancy",
    description: "Personalized guidance tailored to your specific pregnancy needs and stage.",
    price: 2499,
    duration: 60
  },
  {
    name: "Postnatal Recovery & Rejuvenation",
    category: "postnatal",
    description: "Restore your body and spirit with Ayurvedic postpartum care practices.",
    price: 3999,
    duration: 60
  },
  {
    name: "Mother-Baby Bonding Sessions",
    category: "postnatal",
    description: "Strengthen your connection with your newborn through mindful practices.",
    price: 2999,
    duration: 45
  },
  {
    name: "Lactation & Wellness Support",
    category: "postnatal",
    description: "Expert guidance on nutrition, wellness, and healthy lactation practices.",
    price: 1999,
    duration: 45
  }
])

console.log("✅ Services seeded successfully")

EOF

echo "🌿 Database seeding completed!"
