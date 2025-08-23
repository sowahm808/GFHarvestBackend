const docGetMock = jest.fn();
const docUpdateMock = jest.fn();
const docMock = jest.fn(() => ({ get: docGetMock, update: docUpdateMock }));

const mockFirestore = {
  collection: jest.fn(() => ({ doc: docMock }))
};

jest.mock('../src/config/firebase', () => ({ firestore: mockFirestore }));

const controller = require('../src/controllers/churchesController');

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('churchesController.getChurch', () => {
  beforeEach(() => {
    docGetMock.mockReset();
    docUpdateMock.mockReset();
    mockFirestore.collection.mockClear();
    docMock.mockClear();
  });

  it('returns church data when found', async () => {
    docGetMock.mockResolvedValue({ exists: true, id: 'c1', data: () => ({ name: 'A', logoUrl: 'logo' }) });
    const req = { params: { id: 'c1' } };
    const res = mockResponse();
    await controller.getChurch(req, res);
    expect(res.json).toHaveBeenCalledWith({ id: 'c1', name: 'A', logoUrl: 'logo' });
  });
});

describe('churchesController.updateChurch', () => {
  beforeEach(() => {
    docGetMock.mockReset();
    docUpdateMock.mockReset();
    mockFirestore.collection.mockClear();
    docMock.mockClear();
  });

  it('updates provided fields', async () => {
    docUpdateMock.mockResolvedValue();
    const req = { params: { id: 'c1' }, body: { name: 'New' } };
    const res = mockResponse();
    await controller.updateChurch(req, res);
    expect(docUpdateMock).toHaveBeenCalledWith({ name: 'New' });
    expect(res.json).toHaveBeenCalledWith({ id: 'c1', name: 'New' });
  });
});
