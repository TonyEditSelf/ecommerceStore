import '@testing-library/jest-dom'

// Global mocks for Next.js and Supabase
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  usePathname() {
    return ''
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Supabase admin client to prevent tests from hitting real DB
jest.mock('@/lib/db', () => ({
  getSupabaseAdmin: jest.fn(),
  connectDB: jest.fn(),
}))
