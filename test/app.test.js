const request = require('supertest');
const app = require('../src/index');

describe('API availability', () => {
  it('should return API status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
});

describe('Auth middleware', () => {
  it('should reject unauthorized mental status POST', async () => {
    const res = await request(app)
      .post('/api/mental-status')
      .send({ childId: 'c1', status: 'ok' });
    expect(res.statusCode).toEqual(401);
  });
});
