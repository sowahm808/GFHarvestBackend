const mockGet = jest.fn();
const mockOrderBy = jest.fn(() => ({ get: mockGet }));
const mockWhere = jest.fn(() => ({ orderBy: mockOrderBy }));
const mockCollection = jest.fn(() => ({ where: mockWhere }));

jest.mock('../src/config/firebase', () => ({
  firestore: { collection: mockCollection },
  admin: { firestore: { FieldValue: { serverTimestamp: jest.fn() } } }
}));

const controller = require('../src/controllers/mentorRecordsController');

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('mentorRecordsController.getRecords', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockOrderBy.mockClear();
    mockWhere.mockClear();
    mockCollection.mockClear();
  });

  it('queries by childId for parents', async () => {
    mockGet.mockResolvedValue({ docs: [] });
    const req = { params: { uid: 'child1' }, user: { role: 'parent' } };
    const res = mockResponse();

    await controller.getRecords(req, res);

    expect(mockCollection).toHaveBeenCalledWith('mentorRecords');
    expect(mockWhere).toHaveBeenCalledWith('childId', '==', 'child1');
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('queries by mentorId for mentors', async () => {
    mockGet.mockResolvedValue({ docs: [] });
    const req = { params: { uid: 'mentor1' }, user: { role: 'mentor' } };
    const res = mockResponse();

    await controller.getRecords(req, res);

    expect(mockWhere).toHaveBeenCalledWith('mentorId', '==', 'mentor1');
    expect(res.json).toHaveBeenCalledWith([]);
  });
});

