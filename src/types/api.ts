// Base API response interfaces
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// User and Profile types
export interface User {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
}

export interface Profile {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
}

// Article types
export interface Author {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Author;
}

export type ArticlePreview = Omit<Article, 'body'>;

// Comment types
export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: Author;
}

// API Response types
export interface UserResponse {
  user: User;
}

export interface ProfileResponse {
  profile: Profile;
}

export interface ArticleResponse {
  article: Article;
}

export interface ArticlesResponse {
  articles: ArticlePreview[];
  articlesCount: number;
}

export interface CommentsResponse {
  comments: Comment[];
}

export interface CommentResponse {
  comment: Comment;
}

export interface TagsResponse {
  tags: string[];
}

// Request types
export interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

export interface RegisterRequest {
  user: {
    username: string;
    email: string;
    password: string;
  };
}

export interface CreateArticleRequest {
  article: {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
  };
}

export interface UpdateArticleRequest {
  article: Partial<{
    title: string;
    description: string;
    body: string;
    tagList: string[];
  }>;
}

export interface CreateCommentRequest {
  comment: {
    body: string;
  };
}

// Query parameters
export interface ArticlesQuery {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
}

export interface FeedQuery {
  limit?: number;
  offset?: number;
}
