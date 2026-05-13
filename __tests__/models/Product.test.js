import { Product } from '@/models/Product';
import { getSupabaseAdmin } from '@/lib/db';

// Create a mock query builder that supports chaining and is awaitable
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
    resolve({ data: [{ id: 1, title: 'Test Product' }], count: 1, error: null });
  };
  return builder;
};

describe('Product Model', () => {
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

  it('find() should correctly apply options like sort and limit without hitting the real DB', async () => {
    const filters = {};
    const options = { sort: { createdAt: -1 }, limit: 100 };

    await Product.find(filters, options);

    expect(dbMock.from).toHaveBeenCalledWith('products');
    expect(mockBuilder.select).toHaveBeenCalledWith('*');
    expect(mockBuilder.order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(mockBuilder.range).toHaveBeenCalledWith(0, 99);
  });

  it('find() should apply filters correctly', async () => {
    const filters = { category: 'projectors', slug: 'pro-1' };
    await Product.find(filters);

    expect(mockBuilder.eq).toHaveBeenCalledWith('category', 'projectors');
    expect(mockBuilder.eq).toHaveBeenCalledWith('slug', 'pro-1');
  });

  it('countDocuments() should query for count', async () => {
    const count = await Product.countDocuments({});

    expect(dbMock.from).toHaveBeenCalledWith('products');
    expect(mockBuilder.select).toHaveBeenCalledWith('*', { count: 'exact' });
    expect(count).toBe(1);
  });
});
