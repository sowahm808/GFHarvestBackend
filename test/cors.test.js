const request = require('supertest');
const app = require('../src/index');

describe('CORS configuration', () => {
  it('returns allowed origin header for preflight requests', async () => {
    const res = await request(app)
      .options('/api/mentors')
      .set('Origin', 'https://kidsfaithtracker.netlify.app')
      .set('Access-Control-Request-Method', 'GET');
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('https://kidsfaithtracker.netlify.app');
  });
});
