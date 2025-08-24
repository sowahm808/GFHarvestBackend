const mockSetClaims = jest.fn().mockResolvedValue();
const mockCreateUser = jest
  .fn()
  .mockResolvedValue({ uid: 'u1', email: 'user@example.com' });
const mockListUsers = jest.fn().mockResolvedValue({ users: [] });
const mockGetUser = jest.fn().mockResolvedValue({});

jest.mock('../src/services/childAccountService', () => ({
  createChildAccount: jest.fn(),
}));

jest.mock('../src/config/firebase', () => ({
  admin: {
    auth: () => ({
      setCustomUserClaims: mockSetClaims,
      createUser: mockCreateUser,
      listUsers: mockListUsers,
      getUser: mockGetUser,
    }),
  },
}));

const { createChildAccount } = require('../src/services/childAccountService');
const usersController = require('../src/controllers/usersController');

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('usersController.addChild', () => {
  beforeEach(() => {
    createChildAccount.mockReset();
  });

  it('creates child account using service', async () => {
    createChildAccount.mockResolvedValue({ uid: 'c1', email: 'child@example.com' });
    const req = {
      body: { email: 'child@example.com', password: 'pass', name: 'Kid', age: 9 },
      user: { uid: 'parent1' },
    };
    const res = mockResponse();

    await usersController.addChild(req, res);

    expect(createChildAccount).toHaveBeenCalledWith({
      email: 'child@example.com',
      password: 'pass',
      name: 'Kid',
      age: 9,
      parentId: 'parent1',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ uid: 'c1', email: 'child@example.com' });
  });
});

describe('usersController.setAdminRole', () => {
  beforeEach(() => {
    mockSetClaims.mockClear();
  });

  it('sets admin role for given uid', async () => {
    const req = { body: { uid: 'admin1' } };
    const res = mockResponse();

    await usersController.setAdminRole(req, res);

    expect(mockSetClaims).toHaveBeenCalledWith('admin1', { role: 'admin' });
    expect(res.json).toHaveBeenCalledWith({ uid: 'admin1', role: 'admin' });
  });
});

describe('usersController.assignRole', () => {
  beforeEach(() => {
    mockSetClaims.mockClear();
  });

  it('assigns specified role to user', async () => {
    const req = { body: { uid: 'user1', role: 'mentor' } };
    const res = mockResponse();

    await usersController.assignRole(req, res);

    expect(mockSetClaims).toHaveBeenCalledWith('user1', { role: 'mentor' });
    expect(res.json).toHaveBeenCalledWith({ uid: 'user1', role: 'mentor' });
  });
});

describe('usersController.register', () => {
  beforeEach(() => {
    mockCreateUser.mockClear();
    mockSetClaims.mockClear();
  });

  it('creates user with pending role and requested role stored', async () => {
    const req = {
      body: {
        email: 'new@example.com',
        password: 'pass',
        name: 'New User',
        role: 'mentor',
      },
    };
    const res = mockResponse();

    await usersController.register(req, res);

    expect(mockCreateUser).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'pass',
      displayName: 'New User',
    });
    expect(mockSetClaims).toHaveBeenCalledWith('u1', {
      role: 'pending',
      requestedRole: 'mentor',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      uid: 'u1',
      email: 'user@example.com',
      requestedRole: 'mentor',
    });
  });
});

describe('usersController.listPendingUsers', () => {
  beforeEach(() => {
    mockListUsers.mockClear();
  });

  it('returns only users with pending role', async () => {
    mockListUsers.mockResolvedValue({
      users: [
        {
          uid: 'p1',
          email: 'p1@example.com',
          displayName: 'Pending',
          customClaims: { role: 'pending', requestedRole: 'mentor' },
        },
        { uid: 'u2', email: 'u2@example.com', customClaims: { role: 'child' } },
      ],
    });

    const req = {};
    const res = mockResponse();

    await usersController.listPendingUsers(req, res);

    expect(res.json).toHaveBeenCalledWith([
      {
        uid: 'p1',
        email: 'p1@example.com',
        displayName: 'Pending',
        requestedRole: 'mentor',
      },
    ]);
  });
});

describe('usersController.approveUser', () => {
  beforeEach(() => {
    mockGetUser.mockClear();
    mockSetClaims.mockClear();
  });

  it('sets requested role as active role', async () => {
    mockGetUser.mockResolvedValue({
      customClaims: { requestedRole: 'mentor' },
    });

    const req = { body: { uid: 'u1' } };
    const res = mockResponse();

    await usersController.approveUser(req, res);

    expect(mockGetUser).toHaveBeenCalledWith('u1');
    expect(mockSetClaims).toHaveBeenCalledWith('u1', { role: 'mentor' });
    expect(res.json).toHaveBeenCalledWith({ uid: 'u1', role: 'mentor' });
  });
});
