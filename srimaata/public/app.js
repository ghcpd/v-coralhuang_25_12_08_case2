document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value,
    email: form.email.value,
    date: form.date.value,
    time: form.time.value,
    message: form.message.value,
    amount: form.amount.value || 0
  };
  const resultEl = document.getElementById('result');
  resultEl.textContent = 'Sending...';
  try {
    const res = await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Failed');
    const json = await res.json();
    resultEl.textContent = 'Booked! Reference: ' + json.id;
    form.reset();
  } catch (err) {
    console.error(err);
    resultEl.textContent = 'Failed to book appointment. Please try again later.';
  }
});
