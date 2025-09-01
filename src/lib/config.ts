// API configuration

const getHost = () => {
  if (typeof window === "undefined") {
    // Server-side: use environment variable or fallback
    return process.env.NEXT_PUBLIC_API_URL || 
           process.env.__NEXT_PRIVATE_ORIGIN || 
           'http://localhost:3000';
  } else {
    // Client-side: use current origin
    return window.location.origin;
  }
};

const host = getHost();

export const API_CONFIG = {
  BASE_URL: `${host}/api/proxy/`,
  TIMEOUT: 10000,
  DEFAULT_LIMIT: 5,
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  ARTICLES_REVALIDATE: 300, // 5 minutes
  ARTICLE_REVALIDATE: 600, // 10 minutes
  TAGS_REVALIDATE: 3600, // 1 hour
} as const;
