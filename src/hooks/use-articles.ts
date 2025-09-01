'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArticlesService } from '@/services';
import { useOfflineCache, useOnlineStatus } from '@/hooks';
import type { ArticlesResponse, ArticlesQuery } from '@/types';

interface UseArticlesOptions {
  initialData?: ArticlesResponse;
  enabled?: boolean;
}

export const useArticles = (
  query: ArticlesQuery = {},
  options: UseArticlesOptions = {}
) => {
  const { initialData, enabled = true } = options;
  const { getCachedArticles, cacheArticles } = useOfflineCache();
  const isOnline = useOnlineStatus();
  const isFetchingRef = useRef(false);
  const requestIdRef = useRef(0);
  
  const [data, setData] = useState<ArticlesResponse | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData && enabled);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<ArticlesQuery>(query);

  const fetchArticles = useCallback(async () => {
    if (!enabled || isFetchingRef.current) {
      console.log('useArticles: Skipping fetch - enabled:', enabled, 'isFetching:', isFetchingRef.current);
      return;
    }
    
    const currentRequestId = ++requestIdRef.current;
    console.log('useArticles: Starting fetch for query:', query, 'requestId:', currentRequestId);
    
    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);
      
      // Clear previous data when fetching new query
      if (query.tag !== currentQuery.tag || query.offset !== currentQuery.offset) {
        setData(undefined);
      }
      
      // If offline, try to get from cache first
      if (!isOnline) {
        const cachedData = getCachedArticles(query.limit, query.offset);
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          return;
        } else {
          throw new Error('You are currently offline and no cached data is available');
        }
      }

      // Online: fetch from API
      const response = await ArticlesService.getArticles(query);
      
      // Check if this is still the latest request
      if (currentRequestId !== requestIdRef.current) {
        console.log('useArticles: Staling request, ignoring response');
        return;
      }
      
      console.log('useArticles: Fetch completed successfully');
      setData(response);
      setCurrentQuery(query);
      
      // Cache the response for offline use
      cacheArticles(response);
      
    } catch (err) {
      // Check if this is still the latest request
      if (currentRequestId !== requestIdRef.current) {
        console.log('useArticles: Stale request error, ignoring');
        return;
      }
      
      console.error('useArticles: Fetch failed:', err);
      // If online request fails, try cache as fallback
      if (isOnline) {
        const cachedData = getCachedArticles(query.limit, query.offset);
        if (cachedData) {
          setData(cachedData);
          setError('Network error - showing cached content');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch articles');
        }
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      }
    } finally {
      // Only update state if this is still the latest request
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    }
  }, [query, currentQuery, enabled, isOnline, getCachedArticles, cacheArticles]);

  useEffect(() => {
    // Update current query when query prop changes
    setCurrentQuery(query);
  }, [query]);

  useEffect(() => {
    // Fetch when there's no initial data or when query changes
    if (enabled) {
      fetchArticles();
    }
  }, [query.limit, query.offset, query.tag, enabled]);

  // Reset loading state when query changes
  useEffect(() => {
    if (enabled) {
      setIsLoading(true);
    }
  }, [query.limit, query.offset, query.tag, enabled]);

  const refetch = useCallback(() => {
    return fetchArticles();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
