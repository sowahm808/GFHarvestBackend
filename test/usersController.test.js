const mockSetClaims = jest.fn().mockResolvedValue();

jest.mock('../src/services/childAccountService', () => ({
  createChildAccount: jest.fn(),
}));

jest.mock('../src/config/firebase', () => ({
  admin: { auth: () => ({ setCustomUserClaims: mockSetClaims }) },
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
