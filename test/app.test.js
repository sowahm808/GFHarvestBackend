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

  it('should reject unauthorized children list request', async () => {
    const res = await request(app).get('/api/children');
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized legacy children list request', async () => {
    const res = await request(app).get('/api/child');
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized mentor assignment', async () => {
    const res = await request(app)
      .post('/api/mentors/assign')
      .send({ childId: 'c1', mentorId: 'm1' });
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized mentors list request', async () => {
    const res = await request(app).get('/api/mentors');
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized mentor creation', async () => {
    const res = await request(app)
      .post('/api/mentors')
      .send({ name: 'Test Mentor', email: 'm@example.com', phone: '123' });
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized legacy mentors list request', async () => {
    const res = await request(app).get('/api/mentor');
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized mentor children request', async () => {
    const res = await request(app).get('/api/mentors/m1/children');
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized today quiz request', async () => {
    const res = await request(app).get('/api/quizzes/today');
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized quiz submission', async () => {
    const res = await request(app)
      .post('/api/quizzes/submit')
      .send({ childId: 'c1', quizId: 'q1', answers: [] });
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized quiz history request', async () => {
    const res = await request(app).get('/api/quizzes/history/c1');
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized essay update', async () => {
    const res = await request(app)
      .post('/api/essays')
      .send({ childId: 'c1', status: 'started' });
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized essay progress request', async () => {
    const res = await request(app).get('/api/essays/c1');
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

  it('should reject unauthorized group creation', async () => {
    const res = await request(app)
      .post('/api/groups/create')
      .send({ name: 'Test' });
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized add member', async () => {
    const res = await request(app)
      .post('/api/groups/add-member')
      .send({ groupId: 'g1', childId: 'c1' });
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized group info request', async () => {
    const res = await request(app).get('/api/groups/g1');
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized mentor record creation', async () => {
    const res = await request(app)
      .post('/api/mentors/records')
      .send({ childId: 'c1', notes: 'hi' });
    expect(res.statusCode).toEqual(401);
  });

  it('should reject unauthorized mentor record fetch', async () => {
    const res = await request(app).get('/api/mentors/c1/records');
    expect(res.statusCode).toEqual(401);
  });
});
