document.addEventListener('DOMContentLoaded', () => {
  const apptForm = document.getElementById('appointmentForm');
  if (apptForm) {
    apptForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(apptForm).entries());
      const res = await fetch('/api/appointments', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      const msg = document.getElementById('msg');
      if (res.ok) {
        msg.textContent = 'Appointment booked — we will contact you soon.';
        apptForm.reset();
      } else {
        msg.textContent = 'Error booking appointment.';
      }
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('cmsg').textContent = 'Thanks — we will reply soon.';
      contactForm.reset();
    });
  }
});
