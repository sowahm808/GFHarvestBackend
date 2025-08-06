const mockGetUser = jest.fn();
const mockChildDocGet = jest.fn();
const mockChildrenGet = jest.fn();
const mockChildDoc = jest.fn(() => ({ get: mockChildDocGet }));
const mockMentorGet = jest.fn().mockResolvedValue({ docs: [] });
const mockMentorWhere = jest.fn(() => ({ get: mockMentorGet }));
const mockCollection = jest.fn((name) => {
  if (name === 'children') return { doc: mockChildDoc, get: mockChildrenGet };
  if (name === 'mentorAssignments') return { where: mockMentorWhere };
  return {};
});

jest.mock('../src/config/firebase', () => ({
  admin: { auth: () => ({ getUser: mockGetUser }) },
  firestore: { collection: mockCollection },
}));

const childrenController = require('../src/controllers/childrenController');

function mockResponse() {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
}

describe('childrenController.getChildProfile', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockChildDocGet.mockReset();
    mockChildrenGet.mockReset();
    mockChildDoc.mockClear();
    mockMentorWhere.mockClear();
    mockMentorGet.mockClear();
    mockCollection.mockClear();
  });

  it('returns profile with age', async () => {
    mockGetUser.mockResolvedValue({ uid: 'c1', email: 'c1@example.com', displayName: 'Kid' });
    mockChildDocGet.mockResolvedValue({ exists: true, data: () => ({ age: 10 }) });
    const req = { params: { childId: 'c1' } };
    const res = mockResponse();

    await childrenController.getChildProfile(req, res);

    expect(mockCollection).toHaveBeenCalledWith('children');
    expect(mockChildDoc).toHaveBeenCalledWith('c1');
    expect(mockChildDocGet).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ uid: 'c1', email: 'c1@example.com', displayName: 'Kid', age: 10, mentors: [] });
  });
});

describe('childrenController.listChildren', () => {
  beforeEach(() => {
    mockChildrenGet.mockReset();
    mockCollection.mockClear();
  });

  it('returns list of children', async () => {
    mockChildrenGet.mockResolvedValue({
      docs: [
        { id: 'c1', data: () => ({ name: 'Kid', age: 10 }) },
      ],
    });
    const req = {};
    const res = mockResponse();

    await childrenController.listChildren(req, res);

    expect(mockCollection).toHaveBeenCalledWith('children');
    expect(res.json).toHaveBeenCalledWith([{ id: 'c1', name: 'Kid', age: 10 }]);
  });
});
