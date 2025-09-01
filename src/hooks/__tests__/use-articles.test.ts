import { renderHook, waitFor } from '@testing-library/react'
import { useArticles } from '../use-articles'
import { ArticlesService } from '@/services'
import { mockArticlesResponse, mockFetch } from '@/__tests__/utils/test-utils'

// Mock the services
jest.mock('@/services', () => ({
  ArticlesService: {
    getArticles: jest.fn(),
  },
}))

// Mock the hooks
jest.mock('@/hooks', () => ({
  useOfflineCache: () => ({
    getCachedArticles: jest.fn(),
    cacheArticles: jest.fn(),
  }),
  useOnlineStatus: () => true,
}))

const mockArticlesService = ArticlesService as jest.Mocked<typeof ArticlesService>

describe('useArticles', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset fetch mock
    global.fetch = mockFetch(mockArticlesResponse)
  })

  describe('Initial State', () => {
    it('should return initial state with loading true when no initial data', () => {
      const { result } = renderHook(() => useArticles({ limit: 10, offset: 0 }))

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeNull()
    })

    it('should return initial state with loading false when initial data provided', () => {
      const { result } = renderHook(() => 
        useArticles({ limit: 10, offset: 0 }, { initialData: mockArticlesResponse })
      )

      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toEqual(mockArticlesResponse)
      expect(result.current.error).toBeNull()
    })
  })

  describe('Data Fetching', () => {
    it('should fetch articles successfully', async () => {
      mockArticlesService.getArticles.mockResolvedValue(mockArticlesResponse)

      const { result } = renderHook(() => useArticles({ limit: 10, offset: 0 }))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toEqual(mockArticlesResponse)
      expect(result.current.error).toBeNull()
      expect(mockArticlesService.getArticles).toHaveBeenCalledWith({ limit: 10, offset: 0 })
    })

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'Failed to fetch articles'
      mockArticlesService.getArticles.mockRejectedValue(new Error(errorMessage))

      const { result } = renderHook(() => useArticles({ limit: 10, offset: 0 }))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBe(errorMessage)
      expect(result.current.data).toBeUndefined()
    })

    it('should handle network errors with fallback to cache', async () => {
      const networkError = new Error('Network error')
      mockArticlesService.getArticles.mockRejectedValue(networkError)

      // Mock offline cache to return data
      const mockGetCachedArticles = jest.fn().mockReturnValue(mockArticlesResponse)
      jest.doMock('@/hooks', () => ({
        useOfflineCache: () => ({
          getCachedArticles: mockGetCachedArticles,
          cacheArticles: jest.fn(),
        }),
        useOnlineStatus: () => true,
      }))

      const { result } = renderHook(() => useArticles({ limit: 10, offset: 0 }))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toEqual(mockArticlesResponse)
      expect(result.current.error).toContain('Network error')
    })
  })

  describe('Query Changes', () => {
    it('should refetch when tag changes', async () => {
      mockArticlesService.getArticles.mockResolvedValue(mockArticlesResponse)

      const { result, rerender } = renderHook(
        ({ query }) => useArticles(query),
        { initialProps: { query: { limit: 10, offset: 0 } } }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Change tag
      rerender({ query: { limit: 10, offset: 0, tag: 'react' } })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(mockArticlesService.getArticles).toHaveBeenCalledWith({ 
        limit: 10, 
        offset: 0, 
        tag: 'react' 
      })
    })

    it('should refetch when pagination changes', async () => {
      mockArticlesService.getArticles.mockResolvedValue(mockArticlesResponse)

      const { result, rerender } = renderHook(
        ({ query }) => useArticles(query),
        { initialProps: { query: { limit: 10, offset: 0 } } }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Change page
      rerender({ query: { limit: 10, offset: 10 } })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(mockArticlesService.getArticles).toHaveBeenCalledWith({ 
        limit: 10, 
        offset: 10 
      })
    })

    it('should clear previous data when query changes', async () => {
      mockArticlesService.getArticles.mockResolvedValue(mockArticlesResponse)

      const { result, rerender } = renderHook(
        ({ query }) => useArticles(query),
        { initialProps: { query: { limit: 10, offset: 0 } } }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toEqual(mockArticlesResponse)

      // Change tag - should clear data immediately
      rerender({ query: { limit: 10, offset: 0, tag: 'react' } })

      // Data should be cleared while loading
      expect(result.current.data).toBeUndefined()
      expect(result.current.isLoading).toBe(true)
    })
  })

  describe('Offline Handling', () => {
    it('should use cached data when offline', async () => {
      // Mock offline status
      jest.doMock('@/hooks', () => ({
        useOfflineCache: () => ({
          getCachedArticles: jest.fn().mockReturnValue(mockArticlesResponse),
          cacheArticles: jest.fn(),
        }),
        useOnlineStatus: () => false,
      }))

      const { result } = renderHook(() => useArticles({ limit: 10, offset: 0 }))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toEqual(mockArticlesResponse)
      expect(mockArticlesService.getArticles).not.toHaveBeenCalled()
    })

    it('should handle offline with no cache gracefully', async () => {
      // Mock offline status with no cache
      jest.doMock('@/hooks', () => ({
        useOfflineCache: () => ({
          getCachedArticles: jest.fn().mockReturnValue(null),
          cacheArticles: jest.fn(),
        }),
        useOnlineStatus: () => false,
      }))

      const { result } = renderHook(() => useArticles({ limit: 10, offset: 0 }))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBe('You are currently offline and no cached data is available')
      expect(result.current.data).toBeUndefined()
    })
  })

  describe('Loading States', () => {
    it('should show loading state during fetch', async () => {
      // Mock a slow response
      mockArticlesService.getArticles.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockArticlesResponse), 100))
      )

      const { result } = renderHook(() => useArticles({ limit: 10, offset: 0 }))

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should reset loading state on query changes', async () => {
      mockArticlesService.getArticles.mockResolvedValue(mockArticlesResponse)

      const { result, rerender } = renderHook(
        ({ query }) => useArticles(query),
        { initialProps: { query: { limit: 10, offset: 0 } } }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Change query
      rerender({ query: { limit: 10, offset: 0, tag: 'react' } })

      expect(result.current.isLoading).toBe(true)
    })
  })

  describe('Refetch Functionality', () => {
    it('should allow manual refetch', async () => {
      mockArticlesService.getArticles.mockResolvedValue(mockArticlesResponse)

      const { result } = renderHook(() => useArticles({ limit: 10, offset: 0 }))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Clear mock calls
      mockArticlesService.getArticles.mockClear()

      // Manual refetch
      await result.current.refetch()

      expect(mockArticlesService.getArticles).toHaveBeenCalledWith({ limit: 10, offset: 0 })
    })
  })

  describe('Edge Cases', () => {
    it('should handle concurrent requests correctly', async () => {
      // Mock a slow first request
      let firstRequestResolve: (value: any) => void
      const firstRequest = new Promise(resolve => {
        firstRequestResolve = resolve
      })

      // Mock a fast second request
      const secondRequest = Promise.resolve(mockArticlesResponse)

      mockArticlesService.getArticles
        .mockImplementationOnce(() => firstRequest)
        .mockImplementationOnce(() => secondRequest)

      const { result, rerender } = renderHook(
        ({ query }) => useArticles(query),
        { initialProps: { query: { limit: 10, offset: 0 } } }
      )

      // Start first request
      expect(result.current.isLoading).toBe(true)

      // Change query to trigger second request
      rerender({ query: { limit: 10, offset: 0, tag: 'react' } })

      // Second request should complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // First request should be ignored
      firstRequestResolve!(mockArticlesResponse)

      // Should still show second request data
      expect(result.current.data).toEqual(mockArticlesResponse)
    })

    it('should handle disabled state', () => {
      const { result } = renderHook(() => 
        useArticles({ limit: 10, offset: 0 }, { enabled: false })
      )

      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeUndefined()
      expect(mockArticlesService.getArticles).not.toHaveBeenCalled()
    })
  })
})
