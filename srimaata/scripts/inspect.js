console.log('Inspecting DB...');
const { getAppointments } = require('../db');
getAppointments().then(rows => { console.log('rows length:', (rows && rows.length) || 0); console.log(rows); process.exit(0); }).catch(err => { console.error('ERROR', err); process.exit(1); });
