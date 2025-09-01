import React from 'react'
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils'
import TagSelector from '../tag-selector'
import { mockTags } from '@/__tests__/utils/test-utils'

// Mock Next.js navigation
const mockPush = jest.fn()
const mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}))

describe('TagSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSearchParams.clear()
  })

  describe('Rendering', () => {
    it('should render all tags when tags array is provided', () => {
      render(<TagSelector tags={mockTags} />)

      mockTags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument()
      })
    })

    it('should render tags as clickable badges', () => {
      render(<TagSelector tags={mockTags} />)

      const tagBadges = screen.getAllByRole('button')
      expect(tagBadges).toHaveLength(mockTags.length)

      tagBadges.forEach((badge, index) => {
        expect(badge).toHaveTextContent(mockTags[index])
        expect(badge).toHaveClass('cursor-pointer')
      })
    })

    it('should handle empty tags array', () => {
      render(<TagSelector tags={[]} />)

      expect(screen.getByText('No tags available')).toBeInTheDocument()
    })

    it('should limit displayed tags to 20', () => {
      const manyTags = Array.from({ length: 25 }, (_, i) => `tag-${i}`)
      
      render(<TagSelector tags={manyTags} />)

      const tagBadges = screen.getAllByRole('button')
      expect(tagBadges).toHaveLength(20)
      expect(screen.getByText('tag-0')).toBeInTheDocument()
      expect(screen.getByText('tag-19')).toBeInTheDocument()
      expect(screen.queryByText('tag-20')).not.toBeInTheDocument()
    })
  })

  describe('Tag Selection', () => {
    it('should highlight selected tag with default variant', () => {
      const selectedTag = 'react'
      render(<TagSelector tags={mockTags} selectedTag={selectedTag} />)

      const selectedTagElement = screen.getByText(selectedTag)
      expect(selectedTagElement).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('should show unselected tags with secondary variant', () => {
      const selectedTag = 'react'
      render(<TagSelector tags={mockTags} selectedTag={selectedTag} />)

      const unselectedTags = mockTags.filter(tag => tag !== selectedTag)
      unselectedTags.forEach(tag => {
        const tagElement = screen.getByText(tag)
        expect(tagElement).toHaveClass('bg-secondary', 'text-secondary-foreground')
      })
    })

    it('should handle no selected tag', () => {
      render(<TagSelector tags={mockTags} />)

      const allTags = screen.getAllByRole('button')
      allTags.forEach(tag => {
        expect(tag).toHaveClass('bg-secondary', 'text-secondary-foreground')
      })
    })
  })

  describe('Tag Click Behavior', () => {
    it('should navigate to tag filter when clicking unselected tag', () => {
      render(<TagSelector tags={mockTags} />)

      const tagToClick = 'react'
      fireEvent.click(screen.getByText(tagToClick))

      expect(mockPush).toHaveBeenCalledWith('/?tag=react')
    })

    it('should remove tag filter when clicking selected tag', () => {
      const selectedTag = 'react'
      render(<TagSelector tags={mockTags} selectedTag={selectedTag} />)

      fireEvent.click(screen.getByText(selectedTag))

      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('should preserve existing query parameters when adding tag', () => {
      mockSearchParams.set('page', '2')
      render(<TagSelector tags={mockTags} />)

      fireEvent.click(screen.getByText('react'))

      expect(mockPush).toHaveBeenCalledWith('/?page=2&tag=react')
    })

    it('should reset page when changing tag filter', () => {
      mockSearchParams.set('page', '3')
      mockSearchParams.set('tag', 'typescript')
      render(<TagSelector tags={mockTags} selectedTag="typescript" />)

      fireEvent.click(screen.getByText('react'))

      expect(mockPush).toHaveBeenCalledWith('/?tag=react')
      // Page should be removed
      expect(mockPush).not.toHaveBeenCalledWith(expect.stringContaining('page=3'))
    })
  })

  describe('Navigation Logic', () => {
    it('should build correct URL for tag selection', () => {
      render(<TagSelector tags={mockTags} />)

      fireEvent.click(screen.getByText('nextjs'))

      expect(mockPush).toHaveBeenCalledWith('/?tag=nextjs')
    })

    it('should build correct URL for tag deselection', () => {
      render(<TagSelector tags={mockTags} selectedTag="nextjs" />)

      fireEvent.click(screen.getByText('nextjs'))

      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('should handle complex query parameters', () => {
      mockSearchParams.set('page', '2')
      mockSearchParams.set('sort', 'newest')
      render(<TagSelector tags={mockTags} />)

      fireEvent.click(screen.getByText('testing'))

      expect(mockPush).toHaveBeenCalledWith('/?page=2&sort=newest&tag=testing')
    })
  })

  describe('User Experience', () => {
    it('should show hover effects on tags', () => {
      render(<TagSelector tags={mockTags} />)

      const tagBadges = screen.getAllByRole('button')
      tagBadges.forEach(badge => {
        expect(badge).toHaveClass('hover:opacity-80', 'transition-opacity')
      })
    })

    it('should be accessible with proper button roles', () => {
      render(<TagSelector tags={mockTags} />)

      const tagButtons = screen.getAllByRole('button')
      expect(tagButtons).toHaveLength(mockTags.length)

      tagButtons.forEach(button => {
        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('type', 'button')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle tags with special characters', () => {
      const specialTags = ['react-js', 'c++', 'c#', 'node.js']
      render(<TagSelector tags={specialTags} />)

      specialTags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument()
      })
    })

    it('should handle very long tag names', () => {
      const longTag = 'very-long-tag-name-that-might-cause-layout-issues'
      render(<TagSelector tags={[longTag]} />)

      expect(screen.getByText(longTag)).toBeInTheDocument()
    })

    it('should handle duplicate tags gracefully', () => {
      const duplicateTags = ['react', 'react', 'typescript']
      render(<TagSelector tags={duplicateTags} />)

      // Should render all tags, including duplicates
      expect(screen.getAllByText('react')).toHaveLength(2)
      expect(screen.getByText('typescript')).toBeInTheDocument()
    })

    it('should handle undefined selectedTag prop', () => {
      render(<TagSelector tags={mockTags} selectedTag={undefined} />)

      const allTags = screen.getAllByRole('button')
      allTags.forEach(tag => {
        expect(tag).toHaveClass('bg-secondary', 'text-secondary-foreground')
      })
    })
  })

  describe('Performance', () => {
    it('should render large number of tags efficiently', () => {
      const largeTagArray = Array.from({ length: 100 }, (_, i) => `tag-${i}`)
      
      const startTime = performance.now()
      render(<TagSelector tags={largeTagArray} />)
      const endTime = performance.now()

      // Should render in reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100)
      
      // Should still limit to 20 tags
      const tagBadges = screen.getAllByRole('button')
      expect(tagBadges).toHaveLength(20)
    })
  })
})
