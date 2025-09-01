import React from 'react'
import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import ArticlesList from '../articles-list'
import { mockArticlesResponse } from '@/__tests__/utils/test-utils'

// Mock the useArticles hook
jest.mock('@/hooks', () => ({
  useArticles: jest.fn(),
}))

const mockUseArticles = jest.mocked(require('@/hooks').useArticles)

describe('ArticlesList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading State', () => {
    it('should show loading spinner when loading and no data', () => {
      mockUseArticles.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      })

      render(<ArticlesList />)

      expect(screen.getByText('Loading articles...')).toBeInTheDocument()
    })

    it('should not show loading spinner when loading but has data', () => {
      mockUseArticles.mockReturnValue({
        data: mockArticlesResponse,
        isLoading: true,
        error: null,
      })

      render(<ArticlesList />)

      expect(screen.queryByText('Loading articles...')).not.toBeInTheDocument()
      expect(screen.getByText('Test Article')).toBeInTheDocument()
    })
  })

  describe('Data Display', () => {
    it('should render articles when data is available', () => {
      mockUseArticles.mockReturnValue({
        data: mockArticlesResponse,
        isLoading: false,
        error: null,
      })

      render(<ArticlesList />)

      expect(screen.getByText('Test Article')).toBeInTheDocument()
      expect(screen.getByText('This is a test article description')).toBeInTheDocument()
      expect(screen.getByText('testuser')).toBeInTheDocument()
    })

    it('should render multiple articles', () => {
      const multipleArticles = {
        articles: [
          { ...mockArticlesResponse.articles[0], slug: 'article-1', title: 'Article 1' },
          { ...mockArticlesResponse.articles[0], slug: 'article-2', title: 'Article 2' },
        ],
        articlesCount: 2,
      }

      mockUseArticles.mockReturnValue({
        data: multipleArticles,
        isLoading: false,
        error: null,
      })

      render(<ArticlesList />)

      expect(screen.getByText('Article 1')).toBeInTheDocument()
      expect(screen.getByText('Article 2')).toBeInTheDocument()
    })

    it('should handle empty articles array', () => {
      const emptyArticles = {
        articles: [],
        articlesCount: 0,
      }

      mockUseArticles.mockReturnValue({
        data: emptyArticles,
        isLoading: false,
        error: null,
      })

      render(<ArticlesList />)

      expect(screen.getByText('No articles are here... yet.')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should display network error message', () => {
      mockUseArticles.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: 'Network error - unable to connect',
      })

      render(<ArticlesList />)

      expect(screen.getByText('Unable to load articles')).toBeInTheDocument()
      expect(screen.getByText('Network error - unable to connect')).toBeInTheDocument()
    })

    it('should display general error message', () => {
      mockUseArticles.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: 'Failed to load articles',
      })

      render(<ArticlesList />)

      expect(screen.getByText('Failed to load articles')).toBeInTheDocument()
      expect(screen.getByText('Failed to load articles')).toBeInTheDocument()
    })

    it('should display offline error message', () => {
      mockUseArticles.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: 'offline',
      })

      render(<ArticlesList />)

      expect(screen.getByText('Unable to load articles')).toBeInTheDocument()
      expect(screen.getByText('offline')).toBeInTheDocument()
    })
  })

  describe('Props Handling', () => {
    it('should pass initialData to useArticles hook', () => {
      mockUseArticles.mockReturnValue({
        data: mockArticlesResponse,
        isLoading: false,
        error: null,
      })

      render(<ArticlesList initialData={mockArticlesResponse} />)

      expect(mockUseArticles).toHaveBeenCalledWith(
        expect.any(Object),
        { initialData: mockArticlesResponse }
      )
    })

    it('should pass query to useArticles hook', () => {
      const query = { limit: 10, offset: 0, tag: 'react' }
      mockUseArticles.mockReturnValue({
        data: mockArticlesResponse,
        isLoading: false,
        error: null,
      })

      render(<ArticlesList query={query} />)

      expect(mockUseArticles).toHaveBeenCalledWith(query, expect.any(Object))
    })

    it('should use default query when none provided', () => {
      mockUseArticles.mockReturnValue({
        data: mockArticlesResponse,
        isLoading: false,
        error: null,
      })

      render(<ArticlesList />)

      expect(mockUseArticles).toHaveBeenCalledWith({}, expect.any(Object))
    })
  })

  describe('Article Rendering', () => {
    it('should render article with all required fields', () => {
      mockUseArticles.mockReturnValue({
        data: mockArticlesResponse,
        isLoading: false,
        error: null,
      })

      render(<ArticlesList />)

      const article = mockArticlesResponse.articles[0]
      
      expect(screen.getByText(article.title)).toBeInTheDocument()
      expect(screen.getByText(article.description)).toBeInTheDocument()
      expect(screen.getByText(article.author.username)).toBeInTheDocument()
    })

    it('should handle articles without optional fields', () => {
      const minimalArticle = {
        ...mockArticlesResponse.articles[0],
        author: {
          ...mockArticlesResponse.articles[0].author,
          bio: null,
          image: null,
        },
      }

      const minimalArticles = {
        articles: [minimalArticle],
        articlesCount: 1,
      }

      mockUseArticles.mockReturnValue({
        data: minimalArticles,
        isLoading: false,
        error: null,
      })

      render(<ArticlesList />)

      expect(screen.getByText(minimalArticle.title)).toBeInTheDocument()
      expect(screen.getByText(minimalArticle.author.username)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      mockUseArticles.mockReturnValue({
        data: mockArticlesResponse,
        isLoading: false,
        error: null,
      })

      render(<ArticlesList />)

      // Should render as a list container
      const container = screen.getByRole('main') || document.body
      expect(container.querySelector('.space-y-6')).toBeInTheDocument()
    })

    it('should show loading state with proper text', () => {
      mockUseArticles.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      })

      render(<ArticlesList />)

      const loadingText = screen.getByText('Loading articles...')
      expect(loadingText).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined data gracefully', () => {
      mockUseArticles.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      })

      render(<ArticlesList />)

      expect(screen.getByText('No articles are here... yet.')).toBeInTheDocument()
    })

    it('should handle null data gracefully', () => {
      mockUseArticles.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      })

      render(<ArticlesList />)

      expect(screen.getByText('No articles are here... yet.')).toBeInTheDocument()
    })

    it('should handle articles with missing author information', () => {
      const incompleteArticle = {
        ...mockArticlesResponse.articles[0],
        author: {
          username: 'testuser',
          bio: null,
          image: null,
          following: false,
        },
      }

      const incompleteArticles = {
        articles: [incompleteArticle],
        articlesCount: 1,
      }

      mockUseArticles.mockReturnValue({
        data: incompleteArticles,
        isLoading: false,
        error: null,
      })

      render(<ArticlesList />)

      expect(screen.getByText(incompleteArticle.title)).toBeInTheDocument()
      expect(screen.getByText(incompleteArticle.author.username)).toBeInTheDocument()
    })
  })
})
