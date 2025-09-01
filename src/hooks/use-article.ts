"use client";

import { useState, useEffect, useCallback } from "react";
import { ArticlesService } from "@/services";
import { useOfflineCache, useOnlineStatus } from "@/hooks";
import type { ArticleResponse } from "@/types";

interface UseArticleOptions {
  initialData?: ArticleResponse;
  enabled?: boolean;
  token?: string;
}

export const useArticle = (slug: string, options: UseArticleOptions = {}) => {
  const { initialData, enabled = true, token } = options;
  const { getCachedArticle, cacheArticle } = useOfflineCache();
  const isOnline = useOnlineStatus();

  const [data, setData] = useState<ArticleResponse | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData && enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async (): Promise<void> => {
    if (!enabled || !slug) return;

    try {
      setIsLoading(true);
      setError(null);

      // If offline, try to get from cache first
      if (!isOnline) {
        const cachedArticle = getCachedArticle(slug);
        if (cachedArticle) {
          setData({ article: cachedArticle });
          setIsLoading(false);
          return;
        } else {
          throw new Error(
            "You are currently offline and this article is not cached"
          );
        }
      }

      // Online: fetch from API
      const response = await ArticlesService.getArticle(slug, token);
      setData(response);

      // Cache the article for offline use
      if (response.article) {
        cacheArticle(response.article);
      }
    } catch (err) {
      // If online request fails, try cache as fallback
      if (isOnline) {
        const cachedArticle = getCachedArticle(slug);
        if (cachedArticle) {
          setData({ article: cachedArticle });
          setError("Network error - showing cached content");
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to fetch article"
          );
        }
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to fetch article"
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [slug, token, enabled, isOnline]);

  useEffect(() => {
    if (!initialData) {
      fetchArticle();
    }
  }, [initialData]);

  const refetch = useCallback(() => {
    return fetchArticle();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
