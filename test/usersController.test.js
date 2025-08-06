const mockSet = jest.fn();
const mockDoc = jest.fn(() => ({ set: mockSet }));
const mockCollection = jest.fn(() => ({ doc: mockDoc }));

const mockCreateUser = jest.fn().mockResolvedValue({ uid: 'c1', email: 'child@example.com' });
const mockSetClaims = jest.fn().mockResolvedValue();

jest.mock('../src/config/firebase', () => ({
  firestore: { collection: mockCollection },
  admin: { auth: () => ({ createUser: mockCreateUser, setCustomUserClaims: mockSetClaims }) },
}));

const usersController = require('../src/controllers/usersController');

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('usersController.addChild', () => {
  beforeEach(() => {
    mockSet.mockReset();
    mockDoc.mockClear();
    mockCollection.mockClear();
    mockCreateUser.mockClear();
    mockSetClaims.mockClear();
  });

  it('creates child account and stores profile', async () => {
    const req = {
      body: { email: 'child@example.com', password: 'pass', name: 'Kid', age: 9 },
      user: { uid: 'parent1' },
    };
    const res = mockResponse();

    await usersController.addChild(req, res);

    expect(mockCreateUser).toHaveBeenCalledWith({ email: 'child@example.com', password: 'pass', displayName: 'Kid' });
    expect(mockSetClaims).toHaveBeenCalledWith('c1', { role: 'child', parentId: 'parent1' });
    expect(mockCollection).toHaveBeenCalledWith('children');
    expect(mockDoc).toHaveBeenCalledWith('c1');
    expect(mockSet).toHaveBeenCalledWith({ name: 'Kid', age: 9, parentId: 'parent1' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ uid: 'c1', email: 'child@example.com' });
  });
});
