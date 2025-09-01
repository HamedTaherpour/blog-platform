# Testing Strategy & Documentation

This document outlines the comprehensive testing strategy for the Blog Platform project, following senior frontend development best practices.

## 🎯 Testing Philosophy

Our testing approach follows the **Testing Pyramid** principle:
- **Unit Tests** (70%): Fast, isolated tests for individual functions and components
- **Integration Tests** (20%): Tests for component interactions and API integration
- **E2E Tests** (10%): Critical user journey tests

## 🏗️ Testing Infrastructure

### Tools & Libraries
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers

### Configuration
- **Jest Config**: `jest.config.js` - Main configuration
- **Setup**: `jest.setup.js` - Global test setup and mocks
- **Coverage**: 70% minimum threshold for all metrics

## 📁 Test Structure

```
src/
├── __tests__/                    # Test utilities and shared mocks
│   └── utils/
│       └── test-utils.tsx       # Custom render, mock data, helpers
├── components/
│   ├── articles/
│   │   └── __tests__/           # Component-specific tests
│   └── common/
│       └── __tests__/
├── hooks/
│   └── __tests__/               # Hook testing
├── services/
│   └── __tests__/               # Service layer testing
└── lib/
    └── __tests__/               # Utility function testing
```

## 🚀 Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Targeted Testing
```bash
# Test specific areas
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:hooks         # Hook tests only
npm run test:components    # Component tests only
npm run test:services      # Service tests only
npm run test:utils         # Utility tests only

# Use test runner for custom patterns
npm run test:runner        # Shows available commands
```

### Test Runner Script
```bash
# Run specific test categories
node scripts/test-runner.js unit
node scripts/test-runner.js components
node scripts/test-runner.js coverage
```

## 🧪 Test Categories

### 1. Unit Tests
**Purpose**: Test individual functions and components in isolation
**Location**: `__tests__/` folders alongside source code
**Examples**:
- Utility functions (date formatting, text truncation)
- Pure functions (slugify, validation)
- Component rendering without external dependencies

```typescript
describe('formatDate', () => {
  it('should format current date correctly', () => {
    const now = new Date()
    const formatted = formatDate(now.toISOString())
    expect(formatted).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/)
  })
})
```

### 2. Component Tests
**Purpose**: Test React components and their behavior
**Focus**: User interactions, props, state changes
**Examples**:
- Component rendering
- User interactions (clicks, form submissions)
- Props handling
- State management

```typescript
describe('ArticlesList', () => {
  it('should render articles when data is available', () => {
    mockUseArticles.mockReturnValue({
      data: mockArticlesResponse,
      isLoading: false,
      error: null,
    })

    render(<ArticlesList />)
    expect(screen.getByText('Test Article')).toBeInTheDocument()
  })
})
```

### 3. Hook Tests
**Purpose**: Test custom React hooks
**Focus**: State changes, side effects, return values
**Examples**:
- State initialization
- Effect dependencies
- Async operations
- Error handling

```typescript
describe('useArticles', () => {
  it('should refetch when tag changes', async () => {
    const { result, rerender } = renderHook(
      ({ query }) => useArticles(query),
      { initialProps: { query: { limit: 10, offset: 0 } } }
    )

    rerender({ query: { limit: 10, offset: 0, tag: 'react' } })
    expect(mockArticlesService.getArticles).toHaveBeenCalledWith({ 
      limit: 10, 
      offset: 0, 
      tag: 'react' 
    })
  })
})
```

### 4. Service Tests
**Purpose**: Test API service layer
**Focus**: HTTP calls, error handling, data transformation
**Examples**:
- API endpoint calls
- Request/response handling
- Error scenarios
- Data validation

```typescript
describe('ArticlesService', () => {
  it('should handle API errors gracefully', async () => {
    const errorMessage = 'Failed to fetch articles'
    mockApiClient.get.mockRejectedValue(new Error(errorMessage))

    await expect(ArticlesService.getArticles()).rejects.toThrow(errorMessage)
  })
})
```

### 5. Integration Tests
**Purpose**: Test component interactions and data flow
**Focus**: Multiple components working together
**Examples**:
- Form submission flow
- Data fetching and display
- User authentication flow
- Component communication

## 🎭 Mocking Strategy

### Service Mocks
```typescript
jest.mock('@/services', () => ({
  ArticlesService: {
    getArticles: jest.fn(),
    createArticle: jest.fn(),
  },
}))
```

### Hook Mocks
```typescript
jest.mock('@/hooks', () => ({
  useOfflineCache: () => ({
    getCachedArticles: jest.fn(),
    cacheArticles: jest.fn(),
  }),
  useOnlineStatus: () => true,
}))
```

### Navigation Mocks
```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => mockSearchParams,
}))
```

## 📊 Test Coverage

### Coverage Thresholds
```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

### Coverage Reports
- **Text Summary**: Console output during test runs
- **HTML Report**: Detailed coverage in `coverage/` folder
- **LCOV**: For CI/CD integration

## 🔧 Test Utilities

### Custom Render Function
```typescript
const customRender = (ui: ReactElement, options?: RenderOptions) => 
  render(ui, { wrapper: AllTheProviders, ...options })

export { customRender as render }
```

### Mock Data
```typescript
export const mockUser = {
  email: 'test@example.com',
  token: 'mock-token-123',
  username: 'testuser',
  bio: 'Test bio',
  image: 'https://example.com/avatar.jpg',
}
```

### Helper Functions
```typescript
export const waitForAsync = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))
export const createMockApiResponse = <T>(data: T, success = true) => 
  success ? Promise.resolve(data) : Promise.reject(new Error('API Error'))
```

## 📝 Writing Tests

### Test Structure
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Feature', () => {
    it('should behave correctly', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

### Best Practices
1. **Descriptive Test Names**: Use "should" statements
2. **Arrange-Act-Assert**: Clear test structure
3. **Single Responsibility**: One assertion per test
4. **Meaningful Mocks**: Realistic test data
5. **Edge Cases**: Test error conditions and boundaries

### Common Patterns
```typescript
// Testing async operations
it('should handle async operation', async () => {
  const result = await asyncOperation()
  expect(result).toBe(expectedValue)
})

// Testing user interactions
it('should respond to user input', () => {
  fireEvent.click(screen.getByRole('button'))
  expect(mockFunction).toHaveBeenCalled()
})

// Testing conditional rendering
it('should show loading state', () => {
  render(<Component isLoading={true} />)
  expect(screen.getByText('Loading...')).toBeInTheDocument()
})
```

## 🚨 Common Issues & Solutions

### 1. Mock Not Working
```typescript
// ❌ Wrong - mock after import
import { MyService } from './my-service'
jest.mock('./my-service')

// ✅ Correct - mock before import
jest.mock('./my-service')
import { MyService } from './my-service'
```

### 2. Async Test Failures
```typescript
// ❌ Wrong - no await
it('should fetch data', () => {
  const result = fetchData()
  expect(result).toBe(expectedData)
})

// ✅ Correct - with await
it('should fetch data', async () => {
  const result = await fetchData()
  expect(result).toBe(expectedData)
})
```

### 3. Component Not Rendering
```typescript
// ❌ Wrong - missing providers
render(<MyComponent />)

// ✅ Correct - with providers
render(
  <AuthProvider>
    <MyComponent />
  </AuthProvider>
)
```

## 🔍 Debugging Tests

### Verbose Output
```bash
npm test -- --verbose
```

### Debug Specific Test
```bash
npm test -- --testNamePattern="specific test name"
```

### Watch Mode with Debug
```bash
npm run test:watch -- --verbose
```

## 📈 Performance Testing

### Test Execution Time
- **Unit Tests**: < 100ms per test
- **Component Tests**: < 500ms per test
- **Integration Tests**: < 2000ms per test

### Memory Usage
- Monitor for memory leaks in long-running tests
- Use `--maxWorkers=1` for debugging

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Tests
  run: npm run test:ci
  env:
    CI: true
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:unit"
    }
  }
}
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🤝 Contributing to Tests

1. **Write Tests First**: Follow TDD when possible
2. **Maintain Coverage**: Keep coverage above 70%
3. **Update Documentation**: Document new test patterns
4. **Review Test Quality**: Ensure tests are meaningful and maintainable

---

**Remember**: Good tests are like good documentation - they help other developers understand your code and catch bugs before they reach production.
