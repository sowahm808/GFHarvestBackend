const listGetMock = jest.fn();
const whereMock = jest.fn(() => ({ get: listGetMock }));
const docUpdateMock = jest.fn();
const docMock = jest.fn(() => ({ update: docUpdateMock }));

const mockFirestore = {
  collection: jest.fn(() => ({ where: whereMock, get: listGetMock, doc: docMock }))
};

jest.mock('../src/config/firebase', () => ({ firestore: mockFirestore }));

const controller = require('../src/controllers/prayerRequestsController');

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('prayerRequestsController.listRequests', () => {
  beforeEach(() => {
    listGetMock.mockReset();
    whereMock.mockClear();
    mockFirestore.collection.mockClear();
  });

  it('filters by userId when provided', async () => {
    listGetMock.mockResolvedValue({ docs: [{ id: 'r1', data: () => ({ userId: 'u1', text: 'hi' }) }] });
    const req = { query: { userId: 'u1' } };
    const res = mockResponse();
    await controller.listRequests(req, res);
    expect(whereMock).toHaveBeenCalledWith('userId', '==', 'u1');
    expect(res.json).toHaveBeenCalledWith([{ id: 'r1', userId: 'u1', text: 'hi' }]);
  });
});

describe('prayerRequestsController.updateRequest', () => {
  beforeEach(() => {
    docUpdateMock.mockReset();
    docMock.mockClear();
    mockFirestore.collection.mockClear();
  });

  it('updates text and recalculates age group', async () => {
    docUpdateMock.mockResolvedValue();
    const req = {
      params: { id: 'r1' },
      body: { text: 'new', birthday: '2000-01-01' }
    };
    const res = mockResponse();
    await controller.updateRequest(req, res);
    expect(docUpdateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'new',
        birthday: '2000-01-01',
        ageGroup: 'adult',
        color: 'purple',
      })
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'r1', text: 'new', ageGroup: 'adult', color: 'purple' })
    );
  });
});
