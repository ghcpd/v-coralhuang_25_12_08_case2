const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'data');
const FILE = path.join(DIR, 'appointments.json');
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

function readDB() {
  try {
    if (!fs.existsSync(FILE)) return [];
    const txt = fs.readFileSync(FILE, 'utf8');
    return JSON.parse(txt || '[]');
  } catch (e) {
    return [];
  }
}

function writeDB(rows) {
  const tmp = FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(rows, null, 2));
  fs.renameSync(tmp, FILE);
}

module.exports = {
  createAppointment({ name, email, phone, date, time, notes }) {
    const rows = readDB();
    const id = rows.length ? Math.max(...rows.map(r => r.id || 0)) + 1 : 1;
    const rec = { id, name, email, phone: phone || '', date, time, notes: notes || '', created_at: new Date().toISOString() };
    rows.push(rec);
    writeDB(rows);
    return id;
  },
  getAllAppointments() {
    const rows = readDB();
    return rows.sort((a,b)=> new Date(b.created_at) - new Date(a.created_at));
  }
};
