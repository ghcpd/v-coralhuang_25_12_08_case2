document.getElementById('appointmentForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const f = e.target;
  const data = {
    name: f.name.value,
    email: f.email.value,
    phone: f.phone.value,
    date: f.date.value,
    time: f.time.value,
    notes: f.notes.value
  };
  const msg = document.getElementById('msg');
  msg.textContent = 'Sending...';
  try{
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed');
    const body = await res.json();
    msg.textContent = 'Appointment booked. Reference: ' + body.id;
    f.reset();
  }catch(err){
    msg.textContent = 'Error booking appointment. Try again.';
  }
});
