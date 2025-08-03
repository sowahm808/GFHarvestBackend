const mockGetUser = jest.fn();

jest.mock('../src/config/firebase', () => ({
  admin: { auth: () => ({ getUser: mockGetUser }) },
  __getUserMock: mockGetUser,
}));

const childAccess = require('../src/middlewares/childAccess');
const { __getUserMock } = require('../src/config/firebase');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('childAccess middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    res = mockRes();
    next = jest.fn();
    __getUserMock.mockReset();
  });

  it('allows a child to access their own data', async () => {
    req = { params: { childId: 'c1' }, user: { role: 'child', uid: 'c1' } };
    await childAccess(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('blocks a child from accessing other child data', async () => {
    req = { params: { childId: 'c2' }, user: { role: 'child', uid: 'c1' } };
    await childAccess(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('allows a parent to access their child', async () => {
    req = { params: { childId: 'c1' }, user: { role: 'parent', uid: 'p1' } };
    __getUserMock.mockResolvedValue({ customClaims: { parentId: 'p1' } });
    await childAccess(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("blocks a parent from accessing another parent's child", async () => {
    req = { params: { childId: 'c1' }, user: { role: 'parent', uid: 'p2' } };
    __getUserMock.mockResolvedValue({ customClaims: { parentId: 'p1' } });
    await childAccess(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
