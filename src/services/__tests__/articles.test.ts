import { ArticlesService } from '../articles'
import { mockArticlesResponse, mockArticle } from '@/__tests__/utils/test-utils'
import { apiClient } from '@/lib/api-client'

// Mock the apiClient
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

const mockApiClient = jest.mocked(apiClient)

describe('ArticlesService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getArticles', () => {
    it('should fetch articles with default parameters', async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse)

      const result = await ArticlesService.getArticles()

      expect(mockApiClient.get).toHaveBeenCalledWith('/articles', {})
      expect(result).toEqual(mockArticlesResponse)
    })

    it('should fetch articles with custom parameters', async () => {
      const query = {
        limit: 20,
        offset: 10,
        tag: 'react',
        author: 'testuser',
        favorited: 'testuser',
      }
      mockApiClient.get.mockResolvedValue(mockArticlesResponse)

      const result = await ArticlesService.getArticles(query)

      expect(mockApiClient.get).toHaveBeenCalledWith('/articles', query)
      expect(result).toEqual(mockArticlesResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('Failed to fetch articles')
      mockApiClient.get.mockRejectedValue(error)

      await expect(ArticlesService.getArticles()).rejects.toThrow('Failed to fetch articles')
      expect(mockApiClient.get).toHaveBeenCalledWith('/articles', {})
    })

    it('should handle network errors', async () => {
      const networkError = new Error('Network error')
      mockApiClient.get.mockRejectedValue(networkError)

      await expect(ArticlesService.getArticles()).rejects.toThrow('Network error')
    })
  })

  describe('getArticle', () => {
    it('should fetch a single article by slug', async () => {
      const articleResponse = { article: mockArticle }
      mockApiClient.get.mockResolvedValue(articleResponse)

      const result = await ArticlesService.getArticle('test-article')

      expect(mockApiClient.get).toHaveBeenCalledWith('/articles/test-article')
      expect(result).toEqual(articleResponse)
    })

    it('should handle article not found', async () => {
      const notFoundError = new Error('Article not found')
      mockApiClient.get.mockRejectedValue(notFoundError)

      await expect(ArticlesService.getArticle('non-existent')).rejects.toThrow('Article not found')
      expect(mockApiClient.get).toHaveBeenCalledWith('/articles/non-existent')
    })

    it('should handle invalid slug', async () => {
      const invalidSlugError = new Error('Invalid slug')
      mockApiClient.get.mockRejectedValue(invalidSlugError)

      await expect(ArticlesService.getArticle('')).rejects.toThrow('Invalid slug')
    })
  })

  describe('createArticle', () => {
    it('should create a new article successfully', async () => {
      const articleData = {
        title: 'New Article',
        description: 'Article description',
        body: 'Article body',
        tagList: ['react', 'typescript'],
      }
      const articleResponse = { article: { ...mockArticle, ...articleData } }
      mockApiClient.post.mockResolvedValue(articleResponse)

      const result = await ArticlesService.createArticle(articleData)

      expect(mockApiClient.post).toHaveBeenCalledWith('/articles', { article: articleData })
      expect(result).toEqual(articleResponse)
    })

    it('should handle validation errors', async () => {
      const articleData = {
        title: '', // Invalid: empty title
        description: 'Article description',
        body: 'Article body',
        tagList: ['react'],
      }
      const validationError = new Error('Title cannot be blank')
      mockApiClient.post.mockRejectedValue(validationError)

      await expect(ArticlesService.createArticle(articleData)).rejects.toThrow('Title cannot be blank')
      expect(mockApiClient.post).toHaveBeenCalledWith('/articles', { article: articleData })
    })

    it('should handle authentication errors', async () => {
      const articleData = {
        title: 'New Article',
        description: 'Article description',
        body: 'Article body',
        tagList: ['react'],
      }
      const authError = new Error('Unauthorized')
      mockApiClient.post.mockRejectedValue(authError)

      await expect(ArticlesService.createArticle(articleData)).rejects.toThrow('Unauthorized')
    })
  })

  describe('updateArticle', () => {
    it('should update an existing article successfully', async () => {
      const updates = {
        title: 'Updated Title',
        description: 'Updated description',
      }
      const articleResponse = { article: { ...mockArticle, ...updates } }
      mockApiClient.put.mockResolvedValue(articleResponse)

      const result = await ArticlesService.updateArticle('test-article', updates)

      expect(mockApiClient.put).toHaveBeenCalledWith('/articles/test-article', { article: updates })
      expect(result).toEqual(articleResponse)
    })

    it('should handle partial updates', async () => {
      const updates = {
        title: 'Only Title Updated',
      }
      const articleResponse = { article: { ...mockArticle, ...updates } }
      mockApiClient.put.mockResolvedValue(articleResponse)

      const result = await ArticlesService.updateArticle('test-article', updates)

      expect(mockApiClient.put).toHaveBeenCalledWith('/articles/test-article', { article: updates })
      expect(result).toEqual(articleResponse)
    })

    it('should handle article not found during update', async () => {
      const updates = { title: 'Updated Title' }
      const notFoundError = new Error('Article not found')
      mockApiClient.put.mockRejectedValue(notFoundError)

      await expect(ArticlesService.updateArticle('non-existent', updates)).rejects.toThrow('Article not found')
    })

    it('should handle unauthorized updates', async () => {
      const updates = { title: 'Updated Title' }
      const unauthorizedError = new Error('Unauthorized')
      mockApiClient.put.mockRejectedValue(unauthorizedError)

      await expect(ArticlesService.updateArticle('test-article', updates)).rejects.toThrow('Unauthorized')
    })
  })

  describe('deleteArticle', () => {
    it('should delete an article successfully', async () => {
      mockApiClient.delete.mockResolvedValue(undefined)

      await ArticlesService.deleteArticle('test-article')

      expect(mockApiClient.delete).toHaveBeenCalledWith('/articles/test-article')
    })

    it('should handle article not found during deletion', async () => {
      const notFoundError = new Error('Article not found')
      mockApiClient.delete.mockRejectedValue(notFoundError)

      await expect(ArticlesService.deleteArticle('non-existent')).rejects.toThrow('Article not found')
    })

    it('should handle unauthorized deletion', async () => {
      const unauthorizedError = new Error('Unauthorized')
      mockApiClient.delete.mockRejectedValue(unauthorizedError)

      await expect(ArticlesService.deleteArticle('test-article')).rejects.toThrow('Unauthorized')
    })
  })

  describe('favoriteArticle', () => {
    it('should favorite an article successfully', async () => {
      const favoritedArticle = { ...mockArticle, favorited: true, favoritesCount: 1 }
      const articleResponse = { article: favoritedArticle }
      mockApiClient.post.mockResolvedValue(articleResponse)

      const result = await ArticlesService.favoriteArticle('test-article')

      expect(mockApiClient.post).toHaveBeenCalledWith('/articles/test-article/favorite')
      expect(result).toEqual(articleResponse)
      expect(result.article.favorited).toBe(true)
      expect(result.article.favoritesCount).toBe(1)
    })

    it('should handle already favorited article', async () => {
      const alreadyFavoritedError = new Error('Article already favorited')
      mockApiClient.post.mockRejectedValue(alreadyFavoritedError)

      await expect(ArticlesService.favoriteArticle('test-article')).rejects.toThrow('Article already favorited')
    })
  })

  describe('unfavoriteArticle', () => {
    it('should unfavorite an article successfully', async () => {
      const unfavoritedArticle = { ...mockArticle, favorited: false, favoritesCount: 0 }
      const articleResponse = { article: unfavoritedArticle }
      mockApiClient.delete.mockResolvedValue(articleResponse)

      const result = await ArticlesService.unfavoriteArticle('test-article')

      expect(mockApiClient.delete).toHaveBeenCalledWith('/articles/test-article/favorite')
      expect(result).toEqual(articleResponse)
      expect(result.article.favorited).toBe(false)
      expect(result.article.favoritesCount).toBe(0)
    })

    it('should handle article not favorited', async () => {
      const notFavoritedError = new Error('Article not favorited')
      mockApiClient.delete.mockRejectedValue(notFavoritedError)

      await expect(ArticlesService.unfavoriteArticle('test-article')).rejects.toThrow('Article not favorited')
    })
  })

  describe('getFeed', () => {
    it('should fetch user feed with default parameters', async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse)

      const result = await ArticlesService.getFeed()

      expect(mockApiClient.get).toHaveBeenCalledWith('/articles/feed', {})
      expect(result).toEqual(mockArticlesResponse)
    })

    it('should fetch user feed with custom parameters', async () => {
      const query = { limit: 10, offset: 0 }
      mockApiClient.get.mockResolvedValue(mockArticlesResponse)

      const result = await ArticlesService.getFeed(query)

      expect(mockApiClient.get).toHaveBeenCalledWith('/articles/feed', query)
      expect(result).toEqual(mockArticlesResponse)
    })

    it('should handle unauthorized feed access', async () => {
      const unauthorizedError = new Error('Unauthorized')
      mockApiClient.get.mockRejectedValue(unauthorizedError)

      await expect(ArticlesService.getFeed()).rejects.toThrow('Unauthorized')
    })
  })

  describe('Error Handling', () => {
    it('should handle malformed API responses', async () => {
      const malformedResponse = { articles: null, articlesCount: 'invalid' }
      mockApiClient.get.mockResolvedValue(malformedResponse)

      const result = await ArticlesService.getArticles()
      expect(result).toEqual(malformedResponse)
    })

    it('should handle empty API responses', async () => {
      const emptyResponse = { articles: [], articlesCount: 0 }
      mockApiClient.get.mockResolvedValue(emptyResponse)

      const result = await ArticlesService.getArticles()
      expect(result).toEqual(emptyResponse)
    })

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout')
      mockApiClient.get.mockRejectedValue(timeoutError)

      await expect(ArticlesService.getArticles()).rejects.toThrow('Request timeout')
    })

    it('should handle server errors', async () => {
      const serverError = new Error('Internal server error')
      mockApiClient.get.mockRejectedValue(serverError)

      await expect(ArticlesService.getArticles()).rejects.toThrow('Internal server error')
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long article titles', async () => {
      const longTitle = 'A'.repeat(1000)
      const articleData = { title: longTitle, description: 'Test', body: 'Test body' }
      const articleResponse = { article: { ...mockArticle, title: longTitle } }
      mockApiClient.post.mockResolvedValue(articleResponse)

      const result = await ArticlesService.createArticle(articleData)
      expect(result.article.title).toBe(longTitle)
    })

    it('should handle articles with many tags', async () => {
      const manyTags = Array.from({ length: 100 }, (_, i) => `tag-${i}`)
      const articleData = {
        title: 'Test Article',
        description: 'Test',
        body: 'Test body',
        tagList: manyTags,
      }
      const articleResponse = { article: { ...mockArticle, tagList: manyTags } }
      mockApiClient.post.mockResolvedValue(articleResponse)

      const result = await ArticlesService.createArticle(articleData)
      expect(result.article.tagList).toHaveLength(100)
    })

    it('should handle articles with special characters', async () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const articleData = {
        title: `Test Article ${specialChars}`,
        description: 'Test',
        body: 'Test body',
        tagList: ['test'],
      }
      const articleResponse = { article: { ...mockArticle, title: articleData.title } }
      mockApiClient.post.mockResolvedValue(articleResponse)

      const result = await ArticlesService.createArticle(articleData)
      expect(result.article.title).toBe(articleData.title)
    })
  })

  describe('Performance', () => {
    it('should handle concurrent requests efficiently', async () => {
      const promises = Array.from({ length: 10 }, () => ArticlesService.getArticles())
      mockApiClient.get.mockResolvedValue(mockArticlesResponse)

      const startTime = performance.now()
      const results = await Promise.all(promises)
      const endTime = performance.now()

      expect(results).toHaveLength(10)
      expect(endTime - startTime).toBeLessThan(1000) // Should complete within 1 second
      expect(mockApiClient.get).toHaveBeenCalledTimes(10)
    })
  })
})
