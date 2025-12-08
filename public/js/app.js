document.addEventListener('DOMContentLoaded', async () => {
  // fetch runtime config (e.g., public Razorpay key)
  try {
    const confRes = await fetch('/api/config');
    const conf = await confRes.json();
    window.SR_CONF = Object.assign(window.SR_CONF || {}, conf);
    if (window.SR_CONF && window.SR_CONF.RAZORPAY_KEY) {
      const s = document.createElement('script'); s.src = 'https://checkout.razorpay.com/v1/checkout.js'; document.head.appendChild(s);
    }
  } catch (err) {
    console.warn('Could not load config', err);
  }
  const form = document.getElementById('booking-form');
  const msg = document.getElementById('msg');
  const payBtn = document.getElementById('book-with-pay');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    msg.textContent = 'Saving appointment…';
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/appointments', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      msg.textContent = 'Booked — we will reach out to confirm. Thank you!';
      form.reset();
    } catch (err) {
      msg.textContent = 'Error: ' + err.message;
    }
  });

  async function bookWithPay() {
    msg.textContent = 'Preparing payment…';
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email || !data.date || !data.time) { msg.textContent = 'Please fill required fields before paying.'; return; }

    // Price placeholder — in a real app you'd calculate or fetch from server
    const amount = 499; // INR

    try {
      // create appointment first
      const apptRes = await fetch('/api/appointments', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...data, amount }) });
      const appt = await apptRes.json();
      if (!apptRes.ok) throw new Error(appt.error || 'appointment create failed');

      // create payment order on server
      const orderRes = await fetch('/api/payment/create-order', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ amount }) });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error || 'order failed');

      // open razorpay checkout if available
      if (window.Razorpay && (window.SR_CONF && window.SR_CONF.RAZORPAY_KEY)) {
        const options = {
          key: window.SR_CONF.RAZORPAY_KEY,
          amount: order.amount,
          currency: order.currency,
          name: 'Srimaata',
          description: data.service || 'Prenatal session',
          order_id: order.id,
          handler: function (resp) { msg.textContent = 'Payment successful. Thank you!'; },
          notes: { appointment_id: appt.id }
        };
        new Razorpay(options).open();
        msg.textContent = '';
      } else {
        msg.textContent = 'Payment flow not available (server not configured for Razorpay). Appointment saved.';
      }
    } catch (err) {
      msg.textContent = 'Error: ' + err.message;
    }
  }

  payBtn.addEventListener('click', bookWithPay);

  // basic calendar rendering for the current month
  const calendarRoot = document.getElementById('calendar');
  function renderCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const first = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    calendarRoot.innerHTML = '';
    // week headers
    ['M','T','W','T','F','S','S'].forEach(d => { const el = document.createElement('div'); el.className='cal-day header'; el.textContent = d; calendarRoot.appendChild(el); });

    // make space for first day (weekday offset; JS Sunday=0 so adjust)
    let offset = (first === 0) ? 6 : first - 1; // shift to Monday start
    for (let i=0;i<offset;i++) { const e=document.createElement('div'); e.className='cal-day empty'; calendarRoot.appendChild(e); }

    for (let d=1; d<=days; d++) {
      const el = document.createElement('div'); el.className='cal-day'; el.textContent = d; calendarRoot.appendChild(el);
    }
  }
  renderCalendar();
});
