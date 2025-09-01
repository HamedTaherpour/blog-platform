import { apiClient } from '@/lib/api-client';
import type { ProfileResponse } from '@/types';

export class ProfilesService {
  /**
   * Get user profile by username
   */
  static async getProfile(username: string, token?: string): Promise<ProfileResponse> {
    return apiClient.get<ProfileResponse>(`/profiles/${username}`, { token });
  }

  /**
   * Follow a user (requires authentication)
   */
  static async followUser(username: string, token: string): Promise<ProfileResponse> {
    return apiClient.post<ProfileResponse>(`/profiles/${username}/follow`, undefined, { token });
  }

  /**
   * Unfollow a user (requires authentication)
   */
  static async unfollowUser(username: string, token: string): Promise<ProfileResponse> {
    return apiClient.delete<ProfileResponse>(`/profiles/${username}/follow`, { token });
  }
}
