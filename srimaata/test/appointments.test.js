const request = require('supertest');
let server;

beforeAll(() => {
  server = require('../server');
});

afterAll((done) => {
  // give server time to close
  setTimeout(done, 100);
});

describe('Appointments API', () => {
  test('POST /api/appointments creates an appointment', async () => {
    const payload = { name: 'Test', email: 't@example.com', date: '2025-12-10', time: '10:00' };
    const res = await request('http://localhost:3000').post('/api/appointments').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
