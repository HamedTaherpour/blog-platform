import { apiClient } from '@/lib/api-client';
import type { TagsResponse } from '@/types';

export class TagsService {
  /**
   * Get all available tags
   */
  static async getTags(): Promise<TagsResponse> {
    return apiClient.get<TagsResponse>('/tags');
  }
}
