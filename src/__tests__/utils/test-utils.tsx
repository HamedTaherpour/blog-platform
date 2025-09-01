import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '@/contexts/auth-context'

// Mock data for tests
export const mockUser = {
  email: 'test@example.com',
  token: 'mock-token-123',
  username: 'testuser',
  bio: 'Test bio',
  image: 'https://example.com/avatar.jpg',
}

export const mockArticle = {
  slug: 'test-article',
  title: 'Test Article',
  description: 'This is a test article description',
  body: 'This is the full body of the test article.',
  tagList: ['test', 'example'],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  favorited: false,
  favoritesCount: 0,
  author: {
    username: 'testuser',
    bio: 'Test bio',
    image: 'https://example.com/avatar.jpg',
    following: false,
  },
}

export const mockArticlesResponse = {
  articles: [mockArticle],
  articlesCount: 1,
}

export const mockTags = ['react', 'typescript', 'nextjs', 'testing']

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Helper function to create mock API responses
export const createMockApiResponse = <T>(data: T, success = true) => {
  if (success) {
    return Promise.resolve(data)
  }
  return Promise.reject(new Error('API Error'))
}

// Helper function to mock API errors
export const createMockApiError = (message = 'API Error') => {
  return Promise.reject(new Error(message))
}

// Helper function to wait for async operations
export const waitForAsync = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to mock localStorage
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Helper function to mock fetch
export const mockFetch = (response: any, ok = true) => {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(response),
      status: ok ? 200 : 400,
      statusText: ok ? 'OK' : 'Bad Request',
    })
  )
}
