'use client';

import { useState } from 'react';
import { ArticlesService } from '@/services';
import { useAuth } from '@/contexts/auth-context';

interface UseFavoriteOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useFavorite = (options: UseFavoriteOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();

  const toggleFavorite = async (
    slug: string, 
    currentlyFavorited: boolean
  ): Promise<boolean> => {
    if (!isAuthenticated || !token) {
      options.onError?.('You must be logged in to favorite articles');
      return currentlyFavorited;
    }

    setIsLoading(true);

    try {
      if (currentlyFavorited) {
        await ArticlesService.unfavoriteArticle(slug, token);
        options.onSuccess?.();
        return false;
      } else {
        await ArticlesService.favoriteArticle(slug, token);
        options.onSuccess?.();
        return true;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update favorite status';
      options.onError?.(message);
      return currentlyFavorited; // Return original state on error
    } finally {
      setIsLoading(false);
    }
  };

  return {
    toggleFavorite,
    isLoading,
  };
};
