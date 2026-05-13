import { Order } from '@/models/Order';
import { getSupabaseAdmin } from '@/lib/db';

const createMockQueryBuilder = () => {
  const builder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
  };
  
  builder.then = function (resolve) {
    resolve({ data: [{ id: 1, total: 500 }], count: 1, error: null });
  };
  return builder;
};

describe('Order Model', () => {
  let dbMock;
  let mockBuilder;

  beforeEach(() => {
    jest.clearAllMocks();
    mockBuilder = createMockQueryBuilder();
    dbMock = {
      from: jest.fn().mockReturnValue(mockBuilder),
    };
    getSupabaseAdmin.mockReturnValue(dbMock);
  });

  it('find() should apply filters and select', async () => {
    await Order.find({ paymentStatus: 'paid' }, { select: 'total' });

    expect(dbMock.from).toHaveBeenCalledWith('orders');
    expect(mockBuilder.select).toHaveBeenCalledWith('total');
    expect(mockBuilder.eq).toHaveBeenCalledWith('payment_status', 'paid');
  });

  it('countDocuments() should query for count', async () => {
    const count = await Order.countDocuments({});
    expect(dbMock.from).toHaveBeenCalledWith('orders');
    expect(mockBuilder.select).toHaveBeenCalledWith('*', { count: 'exact' });
    expect(count).toBe(1);
  });
});
