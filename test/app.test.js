const request = require('supertest');
const app = require('../src/index');

describe('API availability', () => {
  it('should return API status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
});
