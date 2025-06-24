const addMock = jest.fn();
const docGetMock = jest.fn();
const docUpdateMock = jest.fn();

const firestoreMock = {
  collection: jest.fn(() => ({
    add: addMock,
    doc: jest.fn(() => ({ get: docGetMock, update: docUpdateMock })),
    get: jest.fn(),
  })),
};

jest.mock('../src/config/firebase', () => ({
  firestore: firestoreMock,
  admin: {},
}));

const groupsController = require('../src/controllers/groupsController');

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('groupsController.createGroup', () => {
  beforeEach(() => {
    addMock.mockReset();
    firestoreMock.collection.mockClear();
  });

  it('creates a group', async () => {
    addMock.mockResolvedValue({ id: 'g1' });
    const req = { body: { name: 'Test', members: ['c1'] } };
    const res = mockResponse();

    await groupsController.createGroup(req, res);

    expect(addMock).toHaveBeenCalledWith({ name: 'Test', members: ['c1'] });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 'g1', name: 'Test', members: ['c1'] });
  });

  it('rejects when group exceeds max members', async () => {
    const req = { body: { name: 'Big', members: ['1','2','3','4','5','6'] } };
    const res = mockResponse();

    await groupsController.createGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].message).toMatch(/max 5 members/);
  });
});

describe('groupsController.addMember', () => {
  beforeEach(() => {
    docGetMock.mockReset();
    docUpdateMock.mockReset();
    firestoreMock.collection.mockClear();
  });

  it('returns 404 when group missing', async () => {
    docGetMock.mockResolvedValue({ exists: false });
    const req = { body: { groupId: 'g1', childId: 'c1' } };
    const res = mockResponse();

    await groupsController.addMember(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json.mock.calls[0][0].message).toMatch(/Group not found/);
  });
});
