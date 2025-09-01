import { apiClient } from '@/lib/api-client';
import type {
  ArticlesResponse,
  ArticleResponse,
  ArticlesQuery,
  CreateArticleRequest,
  UpdateArticleRequest,
} from '@/types';

export class ArticlesService {
  /**
   * Get all articles with optional filtering
   */
  static async getArticles(params: ArticlesQuery = {}): Promise<ArticlesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.tag) searchParams.append('tag', params.tag);
    if (params.author) searchParams.append('author', params.author);
    if (params.favorited) searchParams.append('favorited', params.favorited);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());

    const query = searchParams.toString();
    const endpoint = `/articles${query ? `?${query}` : ''}`;
    
    return apiClient.get<ArticlesResponse>(endpoint);
  }

  /**
   * Get user's feed articles (requires authentication)
   */
  static async getFeedArticles(
    params: { limit?: number; offset?: number } = {},
    token: string
  ): Promise<ArticlesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());

    const query = searchParams.toString();
    const endpoint = `/articles/feed${query ? `?${query}` : ''}`;
    
    return apiClient.get<ArticlesResponse>(endpoint, { token });
  }

  /**
   * Get a single article by slug
   */
  static async getArticle(slug: string, token?: string): Promise<ArticleResponse> {
    return apiClient.get<ArticleResponse>(`/articles/${slug}`, { token });
  }

  /**
   * Create a new article (requires authentication)
   */
  static async createArticle(
    article: CreateArticleRequest,
    token: string
  ): Promise<ArticleResponse> {
    return apiClient.post<ArticleResponse>('/articles', article, { token });
  }

  /**
   * Update an existing article (requires authentication)
   */
  static async updateArticle(
    slug: string,
    article: UpdateArticleRequest,
    token: string
  ): Promise<ArticleResponse> {
    return apiClient.put<ArticleResponse>(`/articles/${slug}`, article, { token });
  }

  /**
   * Delete an article (requires authentication)
   */
  static async deleteArticle(slug: string, token: string): Promise<void> {
    return apiClient.delete(`/articles/${slug}`, { token });
  }

  /**
   * Favorite an article (requires authentication)
   */
  static async favoriteArticle(
    slug: string,
    token: string
  ): Promise<ArticleResponse> {
    return apiClient.post<ArticleResponse>(`/articles/${slug}/favorite`, undefined, { token });
  }

  /**
   * Unfavorite an article (requires authentication)
   */
  static async unfavoriteArticle(
    slug: string,
    token: string
  ): Promise<ArticleResponse> {
    return apiClient.delete<ArticleResponse>(`/articles/${slug}/favorite`, { token });
  }
}
