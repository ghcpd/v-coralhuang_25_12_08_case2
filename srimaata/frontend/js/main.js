const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentBooking = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    setMinDate();
    setupTabs();
    setupHamburger();
});

// Update auth UI based on login status
function updateAuthUI() {
    const loggedIn = !!localStorage.getItem('authToken');
    document.getElementById('loginLink').classList.toggle('hidden', loggedIn);
    document.getElementById('logoutLink').classList.toggle('hidden', !loggedIn);
    document.getElementById('accountLink').classList.toggle('hidden', !loggedIn);
}

// Set minimum date to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').setAttribute('min', today);
}

// Setup tabs
function setupTabs() {
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

// Setup hamburger menu
function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Scroll to section
function scrollToSection(sectionId) {
    if (!authToken) {
        showLoginModal();
        return;
    }
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
}

// Show login modal
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('authTitle').textContent = 'Login';
    document.getElementById('extraFields').style.display = 'none';
    document.querySelector('.toggle-auth').innerHTML = "Don't have an account? <a href='#' onclick='toggleAuthMode()'>Sign Up</a>";
    document.querySelector('.submit-btn').textContent = 'Login';
}

// Toggle between login and signup
function toggleAuthMode() {
    const title = document.getElementById('authTitle');
    const extraFields = document.getElementById('extraFields');
    const button = document.querySelector('#loginModal .submit-btn');
    const toggle = document.querySelector('.toggle-auth');
    
    if (title.textContent === 'Login') {
        title.textContent = 'Sign Up';
        extraFields.style.display = 'block';
        button.textContent = 'Create Account';
        toggle.innerHTML = "Already have an account? <a href='#' onclick='toggleAuthMode()'>Login</a>";
    } else {
        title.textContent = 'Login';
        extraFields.style.display = 'none';
        button.textContent = 'Login';
        toggle.innerHTML = "Don't have an account? <a href='#' onclick='toggleAuthMode()'>Sign Up</a>";
    }
}

// Authenticate (login/signup)
async function authenticate() {
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const isSignup = document.getElementById('authTitle').textContent === 'Sign Up';
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    if (isSignup && !document.getElementById('authName').value) {
        alert('Please enter your name');
        return;
    }
    
    try {
        const endpoint = isSignup ? '/register' : '/login';
        const body = {
            email,
            password,
        };
        
        if (isSignup) {
            body.name = document.getElementById('authName').value;
            body.phone = document.getElementById('authPhone').value;
        }
        
        const response = await fetch(`${API_URL}/auth${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            authToken = data.token;
            closeModal('loginModal');
            updateAuthUI();
            alert(`${isSignup ? 'Account created' : 'Logged in'} successfully!`);
            document.getElementById('authForm').reset();
        } else {
            alert(data.error || 'Authentication failed');
        }
    } catch (error) {
        console.error('Auth error:', error);
        alert('Error during authentication');
    }
}

// Prepare booking
function prepareBooking(serviceName, price) {
    if (!authToken) {
        showLoginModal();
        return;
    }
    
    currentBooking = { serviceName, price };
    document.getElementById('serviceName').value = serviceName;
    document.getElementById('appointmentPrice').value = `₹${price}`;
    document.getElementById('bookingModal').style.display = 'block';
}

// Proceed to payment
async function proceedToPayment() {
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentTime = document.getElementById('appointmentTime').value;
    const notes = document.getElementById('appointmentNotes').value;
    
    if (!appointmentDate || !appointmentTime) {
        alert('Please select date and time');
        return;
    }
    
    try {
        // Create appointment first
        const appointmentRes = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                serviceName: currentBooking.serviceName,
                appointmentDate,
                appointmentTime,
                notes,
            }),
        });
        
        const appointment = await appointmentRes.json();
        
        if (!appointmentRes.ok) {
            alert(appointment.error || 'Failed to create appointment');
            return;
        }
        
        // Create Razorpay order
        const orderRes = await fetch(`${API_URL}/payments/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                amount: currentBooking.price,
                appointmentId: appointment._id,
            }),
        });
        
        const order = await orderRes.json();
        
        // Open Razorpay checkout
        const options = {
            key: 'your_razorpay_key_id',
            amount: order.amount,
            currency: order.currency,
            name: 'SriMaata',
            description: currentBooking.serviceName,
            order_id: order.id,
            handler: async (response) => {
                // Verify payment
                await verifyPayment(response, appointment._id);
            },
            prefill: {
                contact: '',
                email: localStorage.getItem('userEmail') || '',
            },
            theme: {
                color: '#c97c6d',
            },
        };
        
        const rzp = new Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error('Payment error:', error);
        alert('Error processing payment');
    }
}

// Verify payment
async function verifyPayment(response, appointmentId) {
    try {
        const verifyRes = await fetch(`${API_URL}/payments/verify-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId,
            }),
        });
        
        const result = await verifyRes.json();
        
        if (verifyRes.ok) {
            alert('Payment successful! Your appointment has been confirmed.');
            closeModal('bookingModal');
            document.getElementById('bookingForm').reset();
        } else {
            alert('Payment verification failed: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Verify error:', error);
        alert('Error verifying payment');
    }
}

// Submit contact form
async function submitContactForm() {
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Thank you for reaching out! We will respond soon.');
            document.getElementById('contactForm').reset();
        } else {
            alert(data.error || 'Failed to send message');
        }
    } catch (error) {
        console.error('Contact error:', error);
        alert('Error sending message');
    }
}

// Logout
function logout() {
    localStorage.removeItem('authToken');
    authToken = null;
    updateAuthUI();
    alert('Logged out successfully!');
    window.location.href = '#home';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = (event) => {
    const loginModal = document.getElementById('loginModal');
    const bookingModal = document.getElementById('bookingModal');
    
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target === bookingModal) {
        bookingModal.style.display = 'none';
    }
};
