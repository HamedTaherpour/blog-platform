'use client';

import { useState, useEffect, useCallback } from 'react';
import { CommentsService } from '@/services';
import type { CommentsResponse } from '@/types';

interface UseCommentsOptions {
  initialData?: CommentsResponse;
  enabled?: boolean;
  token?: string;
}

export const useComments = (
  slug: string,
  options: UseCommentsOptions = {}
) => {
  const { initialData, enabled = true, token } = options;
  
  const [data, setData] = useState<CommentsResponse | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData && enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!enabled || !slug) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await CommentsService.getComments(slug, token);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setIsLoading(false);
    }
  }, [slug, token, enabled]);

  useEffect(() => {
    if (!initialData) {
      fetchComments();
    }
  }, [fetchComments, initialData]);

  const refetch = useCallback(() => {
    return fetchComments();
  }, [fetchComments]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
