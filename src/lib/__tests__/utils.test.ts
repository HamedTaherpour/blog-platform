import { truncateText, slugify, debounce, formatNumber, getInitials, cn, isClient } from '../utils'

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2')
      expect(cn('class1', null, 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional')
      expect(cn('base', false && 'conditional')).toBe('base')
    })
  })

  describe('truncateText', () => {
    it('should truncate long text correctly', () => {
      const longText = 'This is a very long text that needs to be truncated to fit within a certain length limit'
      const truncated = truncateText(longText, 30)
      
      expect(truncated.length).toBeLessThanOrEqual(33) // 30 + '...'
      expect(truncated).toEndWith('...')
    })

    it('should not truncate short text', () => {
      const shortText = 'Short text'
      const truncated = truncateText(shortText, 30)
      
      expect(truncated).toBe(shortText)
      expect(truncated).not.toContain('...')
    })

    it('should handle exact length text', () => {
      const exactText = 'Exactly thirty characters long'
      const truncated = truncateText(exactText, 30)
      
      expect(truncated).toBe(exactText)
      expect(truncated).not.toContain('...')
    })

    it('should handle empty text', () => {
      expect(truncateText('', 10)).toBe('')
      expect(truncateText('', 0)).toBe('')
    })

    it('should handle very short maxLength', () => {
      const text = 'Hello world'
      const truncated = truncateText(text, 5)
      
      expect(truncated.length).toBeLessThanOrEqual(8) // 5 + '...'
      expect(truncated).toEndWith('...')
    })

    it('should handle text with special characters', () => {
      const specialText = 'Text with émojis 🚀 and special chars!@#'
      const truncated = truncateText(specialText, 20)
      
      expect(truncated.length).toBeLessThanOrEqual(23) // 20 + '...'
      expect(truncated).toEndWith('...')
    })

    it('should handle text with HTML tags', () => {
      const htmlText = '<p>This is <strong>HTML</strong> text</p>'
      const truncated = truncateText(htmlText, 15)
      
      expect(truncated.length).toBeLessThanOrEqual(18) // 15 + '...'
      expect(truncated).toEndWith('...')
    })
  })

  describe('formatNumber', () => {
    it('should format positive numbers correctly', () => {
      expect(formatNumber(1234)).toBe('1,234')
      expect(formatNumber(1000000)).toBe('1,000,000')
      expect(formatNumber(0)).toBe('0')
    })

    it('should format negative numbers correctly', () => {
      expect(formatNumber(-1234)).toBe('-1,234')
      expect(formatNumber(-1000000)).toBe('-1,000,000')
    })

    it('should format decimal numbers correctly', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56')
      expect(formatNumber(0.123)).toBe('0.123')
    })

    it('should handle edge cases', () => {
      expect(formatNumber(Number.MAX_SAFE_INTEGER)).toBe('9,007,199,254,740,991')
      expect(formatNumber(Number.MIN_SAFE_INTEGER)).toBe('-9,007,199,254,740,991')
    })
  })

  describe('slugify', () => {
    it('should convert simple text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('My Article Title')).toBe('my-article-title')
    })

    it('should handle special characters', () => {
      expect(slugify('Article with @#$% symbols!')).toBe('article-with-symbols')
      expect(slugify('Text with (parentheses) and [brackets]')).toBe('text-with-parentheses-and-brackets')
    })

    it('should handle numbers', () => {
      expect(slugify('Article 123')).toBe('article-123')
      expect(slugify('2024 Year in Review')).toBe('2024-year-in-review')
    })

    it('should handle multiple spaces and hyphens', () => {
      expect(slugify('Multiple    Spaces')).toBe('multiple-spaces')
      expect(slugify('Multiple---Hyphens')).toBe('multiple-hyphens')
    })

    it('should handle accented characters', () => {
      expect(slugify('Café au Lait')).toBe('cafe-au-lait')
      expect(slugify('Héllö Wörld')).toBe('hell-wrld')
    })

    it('should handle empty and null values', () => {
      expect(slugify('')).toBe('')
      expect(slugify(null as any)).toBe('')
      expect(slugify(undefined as any)).toBe('')
    })

    it('should handle very long text', () => {
      const longText = 'A'.repeat(1000)
      const slug = slugify(longText)
      
      expect(slug.length).toBeLessThan(longText.length)
      expect(slug).toMatch(/^[a-z0-9-]+$/)
    })
  })

  describe('isClient', () => {
    it('should return true in browser environment', () => {
      // Mock window object
      const originalWindow = global.window
      global.window = {} as any
      
      expect(isClient()).toBe(true)
      
      // Restore
      global.window = originalWindow
    })

    it('should return false in server environment', () => {
      // Mock server environment
      const originalWindow = global.window
      delete (global as any).window
      
      expect(isClient()).toBe(false)
      
      // Restore
      global.window = originalWindow
    })
  })

  describe('getInitials', () => {
    it('should extract initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD')
      expect(getInitials('Mary Jane Watson')).toBe('MJ')
      expect(getInitials('A B C D E')).toBe('AB')
    })

    it('should handle single name', () => {
      expect(getInitials('John')).toBe('J')
      expect(getInitials('A')).toBe('A')
    })

    it('should handle empty and null values', () => {
      expect(getInitials('')).toBe('')
      expect(getInitials(null as any)).toBe('')
      expect(getInitials(undefined as any)).toBe('')
    })

    it('should handle names with extra spaces', () => {
      expect(getInitials('  John   Doe  ')).toBe('JD')
      expect(getInitials('   A   ')).toBe('A')
    })

    it('should limit to 2 characters', () => {
      expect(getInitials('First Second Third Fourth')).toBe('FS')
      expect(getInitials('One Two Three')).toBe('OT')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should debounce function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 300)

      // Call multiple times
      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      // Fast forward time
      jest.advanceTimersByTime(300)

      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should respect delay parameter', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 500)

      debouncedFn()
      
      // Should not call before delay
      jest.advanceTimersByTime(400)
      expect(mockFn).not.toHaveBeenCalled()

      // Should call after delay
      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments correctly', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1', 'arg2')
      jest.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('should handle multiple debounced functions', () => {
      const mockFn1 = jest.fn()
      const mockFn2 = jest.fn()
      const debouncedFn1 = debounce(mockFn1, 100)
      const debouncedFn2 = debounce(mockFn2, 200)

      debouncedFn1()
      debouncedFn2()

      jest.advanceTimersByTime(100)
      expect(mockFn1).toHaveBeenCalledTimes(1)
      expect(mockFn2).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn2).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle null and undefined inputs gracefully', () => {
      expect(truncateText(null as any, 10)).toBe('')
      expect(truncateText(undefined as any, 10)).toBe('')
      expect(slugify(null as any)).toBe('')
      expect(slugify(undefined as any)).toBe('')
      expect(getInitials(null as any)).toBe('')
      expect(getInitials(undefined as any)).toBe('')
    })

    it('should handle extreme values', () => {
      // Very long text
      const veryLongText = 'A'.repeat(10000)
      expect(() => truncateText(veryLongText, 100)).not.toThrow()
      
      // Very short maxLength
      expect(() => truncateText('Hello', 0)).not.toThrow()
      expect(() => truncateText('Hello', -1)).not.toThrow()
    })

    it('should handle edge case numbers', () => {
      expect(() => formatNumber(Number.MAX_VALUE)).not.toThrow()
      expect(() => formatNumber(Number.MIN_VALUE)).not.toThrow()
      expect(() => formatNumber(Infinity)).not.toThrow()
      expect(() => formatNumber(-Infinity)).not.toThrow()
      expect(() => formatNumber(NaN)).not.toThrow()
    })
  })

  describe('Performance', () => {
    it('should handle large inputs efficiently', () => {
      const largeText = 'A'.repeat(10000)
      const startTime = performance.now()
      
      truncateText(largeText, 100)
      slugify(largeText)
      
      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(100) // Should complete within 100ms
    })

    it('should handle many function calls efficiently', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      const startTime = performance.now()
      
      // Call function many times
      for (let i = 0; i < 1000; i++) {
        debouncedFn()
      }
      
      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(100) // Should complete within 100ms
    })
  })
})
