import { apiClient } from '@/lib/api-client';
import type {
  UserResponse,
  LoginRequest,
  RegisterRequest,
} from '@/types';

export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: LoginRequest): Promise<UserResponse> {
    return apiClient.post<UserResponse>('/users/login', credentials);
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterRequest): Promise<UserResponse> {
    return apiClient.post<UserResponse>('/users', userData);
  }

  /**
   * Get current user (requires authentication)
   */
  static async getCurrentUser(token: string): Promise<UserResponse> {
    return apiClient.get<UserResponse>('/user', { token });
  }

  /**
   * Update user profile (requires authentication)
   */
  static async updateUser(
    updates: Partial<{
      email: string;
      username: string;
      password: string;
      image: string;
      bio: string;
    }>,
    token: string
  ): Promise<UserResponse> {
    return apiClient.put<UserResponse>('/user', { user: updates }, { token });
  }
}
