import { User } from '@/models/User';
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
    resolve({ data: [{ id: 1, email: 'test@example.com', role: 'customer' }], count: 1, error: null });
  };
  return builder;
};

describe('User Model', () => {
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

  it('findOne() should find user by email', async () => {
    await User.findOne({ email: 'TEST@EXAMPLE.com' });

    expect(dbMock.from).toHaveBeenCalledWith('users');
    expect(mockBuilder.eq).toHaveBeenCalledWith('email', 'test@example.com'); // Model should lowercase email
    expect(mockBuilder.single).toHaveBeenCalled();
  });

  it('countDocuments() should apply role filter', async () => {
    const count = await User.countDocuments({ role: 'customer' });
    expect(dbMock.from).toHaveBeenCalledWith('users');
    expect(mockBuilder.eq).toHaveBeenCalledWith('role', 'customer');
    expect(mockBuilder.select).toHaveBeenCalledWith('*', { count: 'exact' });
    expect(count).toBe(1);
  });
});
