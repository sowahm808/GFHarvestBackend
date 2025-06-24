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

  it('should reject unauthorized user profile request', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized child profile request', async () => {
    const res = await request(app).get('/api/children/child1');
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized mentor assignment', async () => {
    const res = await request(app)
      .post('/api/mentors/assign')
      .send({ childId: 'c1', mentorId: 'm1' });
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized mentor children request', async () => {
    const res = await request(app).get('/api/mentors/m1/children');
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized check-in submission', async () => {
    const res = await request(app)
      .post('/api/checkins')
      .send({ childId: 'c1', mood: 'happy' });
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized check-ins fetch', async () => {
    const res = await request(app).get('/api/checkins/c1');
    expect(res.statusCode).toEqual(401);
  });
});
