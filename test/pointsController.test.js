const groupsGetMock = jest.fn();
const whereMock = jest.fn();
const mockFirestore = {
  collection: jest.fn((name) => {
    if (name === 'groups') {
      return { get: groupsGetMock };
    }
    if (name === 'points') {
      return { where: whereMock };
    }
    return {};
  }),
};

jest.mock('../src/config/firebase', () => ({
  firestore: mockFirestore,
  admin: {},
}));

const pointsController = require('../src/controllers/pointsController');

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('pointsController.listGroupPoints', () => {
  beforeEach(() => {
    groupsGetMock.mockReset();
    whereMock.mockReset();
    mockFirestore.collection.mockClear();
  });

  it('aggregates totals for all groups', async () => {
    groupsGetMock.mockResolvedValue({
      docs: [
        { id: 'g1', data: () => ({ members: ['c1'], name: 'G1' }) },
        { id: 'g2', data: () => ({ members: ['c2', 'c3'], name: 'G2' }) },
      ],
    });

    const pointsByChild = {
      c1: [{ data: () => ({ amount: 10 }) }],
      c2: [{ data: () => ({ amount: 5 }) }],
      c3: [{ data: () => ({ amount: 2 }) }],
    };

    whereMock.mockImplementation((_field, _op, childId) => ({
      get: jest.fn().mockResolvedValue({ docs: pointsByChild[childId] || [] }),
    }));

    const res = mockResponse();

    await pointsController.listGroupPoints({}, res);

    expect(res.json).toHaveBeenCalledWith([
      { groupId: 'g1', name: 'G1', total: 10 },
      { groupId: 'g2', name: 'G2', total: 7 },
    ]);
  });
});
