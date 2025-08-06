const mockAdd = jest.fn();
const mockGet = jest.fn();
const mockCollection = jest.fn(() => ({ add: mockAdd, get: mockGet }));

jest.mock('../src/config/firebase', () => ({
  firestore: { collection: mockCollection },
}));

const mentorsController = require('../src/controllers/mentorsController');

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('mentorsController.createMentor', () => {
  beforeEach(() => {
    mockAdd.mockReset();
    mockGet.mockReset();
    mockCollection.mockClear();
  });

  it('creates mentor profile', async () => {
    mockAdd.mockResolvedValue({ id: 'm1' });
    const req = { body: { name: 'Mentor', email: 'm@example.com', phone: '123' } };
    const res = mockResponse();

    await mentorsController.createMentor(req, res);

    expect(mockCollection).toHaveBeenCalledWith('mentors');
    expect(mockAdd).toHaveBeenCalledWith({ name: 'Mentor', email: 'm@example.com', phone: '123' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 'm1', name: 'Mentor', email: 'm@example.com', phone: '123' });
  });
});

describe('mentorsController.listMentors', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockCollection.mockClear();
  });

  it('returns list of mentors', async () => {
    mockGet.mockResolvedValue({
      docs: [
        { id: 'm1', data: () => ({ name: 'Mentor', email: 'm@example.com', phone: '123' }) },
      ],
    });
    const req = {};
    const res = mockResponse();

    await mentorsController.listMentors(req, res);

    expect(mockCollection).toHaveBeenCalledWith('mentors');
    expect(res.json).toHaveBeenCalledWith([
      { id: 'm1', name: 'Mentor', email: 'm@example.com', phone: '123' },
    ]);
  });
});
