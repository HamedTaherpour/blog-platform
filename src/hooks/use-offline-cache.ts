import { useEffect, useState } from 'react';
import { mockArticles, mockTags } from '@/lib/mock-data';
import type { Article, ArticlesResponse } from '@/types';

const CACHE_KEYS = {
  ARTICLES: 'conduit_articles_cache',
  TAGS: 'conduit_tags_cache',
  SINGLE_ARTICLE: 'conduit_article_',
} as const;

export const useOfflineCache = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    // Pre-populate cache with mock data if empty
    initializeCache();
  }, []);

  const initializeCache = () => {
    if (typeof window === 'undefined') return;

    try {
      // Cache articles if not already cached
      const cachedArticles = localStorage.getItem(CACHE_KEYS.ARTICLES);
      if (!cachedArticles) {
        const articlesResponse: ArticlesResponse = {
          articles: mockArticles,
          articlesCount: mockArticles.length,
        };
        localStorage.setItem(CACHE_KEYS.ARTICLES, JSON.stringify(articlesResponse));
      }

      // Cache tags if not already cached
      const cachedTags = localStorage.getItem(CACHE_KEYS.TAGS);
      if (!cachedTags) {
        localStorage.setItem(CACHE_KEYS.TAGS, JSON.stringify(mockTags));
      }

      // Cache individual articles
      mockArticles.forEach(article => {
        const cacheKey = `${CACHE_KEYS.SINGLE_ARTICLE}${article.slug}`;
        const cachedArticle = localStorage.getItem(cacheKey);
        if (!cachedArticle) {
          localStorage.setItem(cacheKey, JSON.stringify(article));
        }
      });

      console.log('Offline cache initialized with mock data');
    } catch (error) {
      console.error('Failed to initialize offline cache:', error);
    }
  };

  const getCachedArticles = (limit?: number, offset?: number): ArticlesResponse | null => {
    if (!isHydrated) return null;
    
    try {
      const cached = localStorage.getItem(CACHE_KEYS.ARTICLES);
      if (!cached) return null;

      const data: ArticlesResponse = JSON.parse(cached);
      
      if (limit !== undefined || offset !== undefined) {
        const start = offset || 0;
        const end = start + (limit || 20);
        return {
          articles: data.articles.slice(start, end),
          articlesCount: data.articlesCount,
        };
      }

      return data;
    } catch (error) {
      console.error('Failed to get cached articles:', error);
      return null;
    }
  };

  const getCachedArticle = (slug: string): Article | null => {
    if (!isHydrated) return null;
    
    try {
      const cached = localStorage.getItem(`${CACHE_KEYS.SINGLE_ARTICLE}${slug}`);
      if (!cached) return null;
      return JSON.parse(cached);
    } catch (error) {
      console.error('Failed to get cached article:', error);
      return null;
    }
  };

  const getCachedTags = (): string[] | null => {
    if (!isHydrated) return null;
    
    try {
      const cached = localStorage.getItem(CACHE_KEYS.TAGS);
      if (!cached) return null;
      return JSON.parse(cached);
    } catch (error) {
      console.error('Failed to get cached tags:', error);
      return null;
    }
  };

  const cacheArticles = (data: ArticlesResponse) => {
    if (!isHydrated) return;
    
    try {
      localStorage.setItem(CACHE_KEYS.ARTICLES, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to cache articles:', error);
    }
  };

  const cacheArticle = (article: Article) => {
    if (!isHydrated) return;
    
    try {
      localStorage.setItem(`${CACHE_KEYS.SINGLE_ARTICLE}${article.slug}`, JSON.stringify(article));
    } catch (error) {
      console.error('Failed to cache article:', error);
    }
  };

  const cacheTags = (tags: string[]) => {
    if (!isHydrated) return;
    
    try {
      localStorage.setItem(CACHE_KEYS.TAGS, JSON.stringify(tags));
    } catch (error) {
      console.error('Failed to cache tags:', error);
    }
  };

  const clearCache = () => {
    if (!isHydrated) return;
    
    try {
      Object.values(CACHE_KEYS).forEach(key => {
        if (key.endsWith('_')) {
          // Clear all keys that start with this prefix
          Object.keys(localStorage).forEach(storageKey => {
            if (storageKey.startsWith(key)) {
              localStorage.removeItem(storageKey);
            }
          });
        } else {
          localStorage.removeItem(key);
        }
      });
      console.log('Cache cleared');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const getCacheSize = (): string => {
    if (!isHydrated) return '0 KB';
    
    try {
      let totalSize = 0;
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('conduit_')) {
          totalSize += localStorage.getItem(key)?.length || 0;
        }
      });
      
      return totalSize < 1024 
        ? `${totalSize} B`
        : totalSize < 1024 * 1024
        ? `${(totalSize / 1024).toFixed(1)} KB`
        : `${(totalSize / (1024 * 1024)).toFixed(1)} MB`;
    } catch (error) {
      console.error('Failed to calculate cache size:', error);
      return '0 KB';
    }
  };

  return {
    isHydrated,
    getCachedArticles,
    getCachedArticle,
    getCachedTags,
    cacheArticles,
    cacheArticle,
    cacheTags,
    clearCache,
    getCacheSize,
  };
};
