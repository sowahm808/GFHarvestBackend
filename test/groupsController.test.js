const addMock = jest.fn();
const docGetMock = jest.fn();
const docUpdateMock = jest.fn();

const mockFirestore = {
  collection: jest.fn(() => ({
    add: addMock,
    doc: jest.fn(() => ({ get: docGetMock, update: docUpdateMock })),
    get: jest.fn(),
  })),
};

jest.mock('../src/config/firebase', () => ({
  firestore: mockFirestore,
  admin: { firestore: { FieldValue: { serverTimestamp: jest.fn() } } },
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
    mockFirestore.collection.mockClear();
  });

  it('creates a group', async () => {
    addMock.mockResolvedValue({ id: 'g1' });
    const req = {
      body: { name: 'Test', type: 'school', ageGroup: '10-12', members: ['c1'] },
      user: { uid: 'u1' },
    };
    const res = mockResponse();

    await groupsController.createGroup(req, res);

    expect(addMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test',
        type: 'school',
        ageGroup: '10-12',
        members: ['c1'],
        mentorId: null,
        createdBy: 'u1',
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 'g1',
      name: 'Test',
      type: 'school',
      ageGroup: '10-12',
      members: ['c1'],
      mentorId: null,
    });
  });

  it('rejects when group exceeds max members', async () => {
    const req = {
      body: {
        name: 'Big',
        type: 'school',
        ageGroup: '10-12',
        members: ['1', '2', '3', '4', '5', '6'],
      },
      user: { uid: 'u1' },
    };
    const res = mockResponse();

    await groupsController.createGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].message).toMatch(/max 5 members/);
  });

  it('rejects invalid group type', async () => {
    const req = {
      body: { name: 'Test', type: 'invalid', ageGroup: '10-12' },
      user: { uid: 'u1' },
    };
    const res = mockResponse();

    await groupsController.createGroup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].message).toMatch(/Valid group type/);
  });
});

describe('groupsController.addMember', () => {
  beforeEach(() => {
    docGetMock.mockReset();
    docUpdateMock.mockReset();
    mockFirestore.collection.mockClear();
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
