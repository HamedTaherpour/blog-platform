import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/__tests__/utils/test-utils'
import { AuthProvider, useAuth } from '../auth-context'
import { mockUser } from '@/__tests__/utils/test-utils'
import { AuthService } from '@/services'

// Mock the AuthService
jest.mock('@/services', () => ({
  AuthService: {
    login: jest.fn(),
    register: jest.fn(),
    getCurrentUser: jest.fn(),
    updateUser: jest.fn(),
  },
}))

const mockAuthService = jest.mocked(AuthService)

// Test component to access context
const TestComponent = () => {
  const { user, token, isAuthenticated, isLoading, login, register, logout } = useAuth()
  
  return (
    <div>
      <div data-testid="user-info">
        {user ? `User: ${user.username}` : 'No user'}
      </div>
      <div data-testid="token-info">
        {token ? `Token: ${token}` : 'No token'}
      </div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      <div data-testid="loading-status">
        {isLoading ? 'Loading' : 'Not loading'}
      </div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={() => register('testuser', 'test@example.com', 'password')}>
        Register
      </button>
      <button onClick={logout}>
        Logout
      </button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear localStorage
    localStorage.clear()
    // Reset fetch mock
    global.fetch = jest.fn()
  })

  describe('Initial State', () => {
    it('should start with no user and loading state', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(screen.getByTestId('user-info')).toHaveTextContent('No user')
      expect(screen.getByTestId('token-info')).toHaveTextContent('No token')
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated')
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Not loading')
    })

    it('should load user from localStorage on mount', async () => {
      // Set up localStorage with user data
      localStorage.setItem('conduit_token', mockUser.token)
      localStorage.setItem('conduit_user', JSON.stringify(mockUser))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not loading')
      })

      expect(screen.getByTestId('user-info')).toHaveTextContent(`User: ${mockUser.username}`)
      expect(screen.getByTestId('token-info')).toHaveTextContent(`Token: ${mockUser.token}`)
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
    })

    it('should handle invalid localStorage data gracefully', async () => {
      // Set up localStorage with invalid data
      localStorage.setItem('conduit_token', 'invalid-token')
      localStorage.setItem('conduit_user', 'invalid-json')

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not loading')
      })

      expect(screen.getByTestId('user-info')).toHaveTextContent('No user')
      expect(screen.getByTestId('token-info')).toHaveTextContent('No token')
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated')
    })
  })

  describe('Login Functionality', () => {
    it('should login user successfully', async () => {
      mockAuthService.login.mockResolvedValue({ user: mockUser })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const loginButton = screen.getByText('Login')
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(screen.getByTestId('user-info')).toHaveTextContent(`User: ${mockUser.username}`)
      })

      expect(screen.getByTestId('token-info')).toHaveTextContent(`Token: ${mockUser.token}`)
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
      expect(localStorage.setItem).toHaveBeenCalledWith('conduit_token', mockUser.token)
      expect(localStorage.setItem).toHaveBeenCalledWith('conduit_user', JSON.stringify(mockUser))
    })

    it('should handle login errors', async () => {
      const errorMessage = 'Invalid credentials'
      mockAuthService.login.mockRejectedValue(new Error(errorMessage))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const loginButton = screen.getByText('Login')
      fireEvent.click(loginButton)

      // Should remain in unauthenticated state
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated')
      })

      expect(screen.getByTestId('user-info')).toHaveTextContent('No user')
      expect(screen.getByTestId('token-info')).toHaveTextContent('No token')
    })

    it('should show loading state during login', async () => {
      // Mock a slow login response
      mockAuthService.login.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ user: mockUser }), 100))
      )

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const loginButton = screen.getByText('Login')
      fireEvent.click(loginButton)

      // Should show loading state
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Loading')

      // Wait for login to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not loading')
      })
    })
  })

  describe('Register Functionality', () => {
    it('should register user successfully', async () => {
      mockAuthService.register.mockResolvedValue({ user: mockUser })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const registerButton = screen.getByText('Register')
      fireEvent.click(registerButton)

      await waitFor(() => {
        expect(screen.getByTestId('user-info')).toHaveTextContent(`User: ${mockUser.username}`)
      })

      expect(screen.getByTestId('token-info')).toHaveTextContent(`Token: ${mockUser.token}`)
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
      expect(localStorage.setItem).toHaveBeenCalledWith('conduit_token', mockUser.token)
      expect(localStorage.setItem).toHaveBeenCalledWith('conduit_user', JSON.stringify(mockUser))
    })

    it('should handle registration errors', async () => {
      const errorMessage = 'Username already taken'
      mockAuthService.register.mockRejectedValue(new Error(errorMessage))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const registerButton = screen.getByText('Register')
      fireEvent.click(registerButton)

      // Should remain in unauthenticated state
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated')
      })

      expect(screen.getByTestId('user-info')).toHaveTextContent('No user')
      expect(screen.getByTestId('token-info')).toHaveTextContent('No token')
    })
  })

  describe('Logout Functionality', () => {
    it('should logout user and clear state', async () => {
      // First login
      mockAuthService.login.mockResolvedValue({ user: mockUser })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const loginButton = screen.getByText('Login')
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
      })

      // Then logout
      const logoutButton = screen.getByText('Logout')
      fireEvent.click(logoutButton)

      expect(screen.getByTestId('user-info')).toHaveTextContent('No user')
      expect(screen.getByTestId('token-info')).toHaveTextContent('No token')
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated')
      expect(localStorage.removeItem).toHaveBeenCalledWith('conduit_token')
      expect(localStorage.removeItem).toHaveBeenCalledWith('conduit_user')
    })

    it('should clear localStorage on logout', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const logoutButton = screen.getByText('Logout')
      fireEvent.click(logoutButton)

      expect(localStorage.removeItem).toHaveBeenCalledWith('conduit_token')
      expect(localStorage.removeItem).toHaveBeenCalledWith('conduit_user')
    })
  })

  describe('Authentication State', () => {
    it('should correctly identify authenticated state', async () => {
      mockAuthService.login.mockResolvedValue({ user: mockUser })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const loginButton = screen.getByText('Login')
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
      })

      expect(screen.getByTestId('isAuthenticated')).toBeTruthy()
    })

    it('should correctly identify unauthenticated state', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated')
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors during login', async () => {
      const networkError = new Error('Network error')
      mockAuthService.login.mockRejectedValue(networkError)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const loginButton = screen.getByText('Login')
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not loading')
      })

      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated')
    })

    it('should handle API errors during registration', async () => {
      const apiError = new Error('API Error: Validation failed')
      mockAuthService.register.mockRejectedValue(apiError)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const registerButton = screen.getByText('Register')
      fireEvent.click(registerButton)

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not loading')
      })

      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated')
    })
  })

  describe('LocalStorage Integration', () => {
    it('should save user data to localStorage on successful auth', async () => {
      mockAuthService.login.mockResolvedValue({ user: mockUser })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const loginButton = screen.getByText('Login')
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('conduit_token', mockUser.token)
        expect(localStorage.setItem).toHaveBeenCalledWith('conduit_user', JSON.stringify(mockUser))
      })
    })

    it('should load user data from localStorage on mount', async () => {
      localStorage.setItem('conduit_token', mockUser.token)
      localStorage.setItem('conduit_user', JSON.stringify(mockUser))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user-info')).toHaveTextContent(`User: ${mockUser.username}`)
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle concurrent login attempts', async () => {
      // Mock a slow first login
      let firstLoginResolve: (value: any) => void
      const firstLogin = new Promise(resolve => {
        firstLoginResolve = resolve
      })

      // Mock a fast second login
      const secondLogin = Promise.resolve({ user: mockUser })

      mockAuthService.login
        .mockImplementationOnce(() => firstLogin)
        .mockImplementationOnce(() => secondLogin)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const loginButton = screen.getByText('Login')
      
      // Start first login
      fireEvent.click(loginButton)
      
      // Start second login immediately
      fireEvent.click(loginButton)

      // Second login should complete
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
      })

      // First login should be ignored
      firstLoginResolve!({ user: { ...mockUser, username: 'firstuser' } })

      // Should still show second login data
      expect(screen.getByTestId('user-info')).toHaveTextContent(`User: ${mockUser.username}`)
    })

    it('should handle malformed user data', async () => {
      const malformedUser = { ...mockUser, token: undefined }
      mockAuthService.login.mockResolvedValue({ user: malformedUser })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const loginButton = screen.getByText('Login')
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not loading')
      })

      // Should handle malformed data gracefully
      expect(screen.getByTestId('user-info')).toHaveTextContent('No user')
    })
  })
})
