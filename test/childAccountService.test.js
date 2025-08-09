const mockSet = jest.fn();
const mockDoc = jest.fn(() => ({ set: mockSet }));
const mockCollection = jest.fn(() => ({ doc: mockDoc }));

const mockCreateUser = jest.fn().mockResolvedValue({ uid: 'child1', email: 'child@example.com' });
const mockSetClaims = jest.fn().mockResolvedValue();

jest.mock('../src/config/firebase', () => ({
  firestore: { collection: mockCollection },
  admin: { auth: () => ({ createUser: mockCreateUser, setCustomUserClaims: mockSetClaims }) },
}));

const { createChildAccount } = require('../src/services/childAccountService');

describe('createChildAccount', () => {
  beforeEach(() => {
    mockSet.mockReset();
    mockDoc.mockClear();
    mockCollection.mockClear();
    mockCreateUser.mockClear();
    mockSetClaims.mockClear();
  });

  it('uses admin SDK to create user, set claims, and store profile', async () => {
    const params = {
      email: 'child@example.com',
      password: 'pass',
      name: 'Kid',
      age: 9,
      parentId: 'parent1',
    };

    const user = await createChildAccount(params);

    expect(mockCreateUser).toHaveBeenCalledWith({ email: 'child@example.com', password: 'pass', displayName: 'Kid' });
    expect(mockSetClaims).toHaveBeenCalledWith('child1', { role: 'child', parentId: 'parent1' });
    expect(mockCollection).toHaveBeenCalledWith('children');
    expect(mockDoc).toHaveBeenCalledWith('child1');
    expect(mockSet).toHaveBeenCalledWith({ name: 'Kid', age: 9, parentId: 'parent1' });
    expect(user.uid).toBe('child1');
  });
});
