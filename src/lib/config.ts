 
export const API_CONFIG = {
  BASE_URL: `${process.env.NEXT_PUBLIC_APP_URL}/api/proxy/`,
  TIMEOUT: 10000,
  DEFAULT_LIMIT: 5,
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  ARTICLES_REVALIDATE: 300, // 5 minutes
  ARTICLE_REVALIDATE: 600, // 10 minutes
  TAGS_REVALIDATE: 3600, // 1 hour
} as const;
