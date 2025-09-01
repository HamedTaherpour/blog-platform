'use client';

import { useArticles } from '@/hooks';
import ArticleCard from './article-card';
import LoadingSpinner from '@/components/common/loading-spinner';
import type { ArticlesResponse, ArticlesQuery } from '@/types';

interface ArticlesListProps {
  initialData?: ArticlesResponse;
  query?: ArticlesQuery;
}


const ArticlesList = ({ initialData, query = {} }: ArticlesListProps) => {
  const { data, isLoading, error } = useArticles(query, { initialData });

  if (error) {
    const isNetworkError = error.includes('Network error') || error.includes('offline');
    
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">
          {isNetworkError ? 'Unable to load articles' : 'Failed to load articles'}
        </p>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <LoadingSpinner className="py-8" text="Loading articles..." />
      </div>
    );
  }

  if (!data || data.articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No articles are here... yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
};

export default ArticlesList;
