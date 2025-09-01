import { apiClient } from '@/lib/api-client';
import type {
  CommentsResponse,
  CommentResponse,
  CreateCommentRequest,
} from '@/types';

export class CommentsService {
  /**
   * Get all comments for an article
   */
  static async getComments(slug: string, token?: string): Promise<CommentsResponse> {
    return apiClient.get<CommentsResponse>(`/articles/${slug}/comments`, { token });
  }

  /**
   * Create a comment for an article (requires authentication)
   */
  static async createComment(
    slug: string,
    comment: CreateCommentRequest,
    token: string
  ): Promise<CommentResponse> {
    return apiClient.post<CommentResponse>(`/articles/${slug}/comments`, comment, { token });
  }

  /**
   * Delete a comment (requires authentication)
   */
  static async deleteComment(
    slug: string,
    commentId: number,
    token: string
  ): Promise<void> {
    return apiClient.delete(`/articles/${slug}/comments/${commentId}`, { token });
  }
}
