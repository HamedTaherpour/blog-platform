
import { Suspense } from 'react';
import { ArticlesService, TagsService } from '@/services';
import { API_CONFIG } from '@/lib/config';
import MainLayout from '@/components/layout/main-layout';
import ArticlesList from '@/components/articles/articles-list';
import PaginationControls from '@/components/common/pagination-controls';
import { Badge } from '@/components/ui/badge';
import TagSelector from '@/components/common/tag-selector';
import { Skeleton } from '@/components/ui/skeleton';
import type { ArticlesQuery } from '@/types';

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    tag?: string;
  }>;
}

// Server Component with SSR
export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1');
  const selectedTag = resolvedSearchParams.tag;
  
  const limit = API_CONFIG.DEFAULT_LIMIT;
  const offset = (currentPage - 1) * limit;

  const query: ArticlesQuery = {
    limit,
    offset,
    ...(selectedTag && { tag: selectedTag }),
  };  

  // Fetch data on server side for SSR
  const [articlesData, tagsData] = await Promise.allSettled([
    ArticlesService.getArticles(query),
    TagsService.getTags(),
  ]);  

  const articles = articlesData.status === 'fulfilled' ? articlesData.value : null;
  const tags = tagsData.status === 'fulfilled' ? tagsData.value.tags : [];
  

  if (!articles) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-destructive">Failed to load articles. Please try again later.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Conduit</h1>
          <p className="text-xl md:text-2xl opacity-90">
            A place to share your knowledge.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold">
                  {selectedTag ? `Articles tagged "${selectedTag}"` : 'Global Feed'}
                </h2>
                {selectedTag && (
                  <Badge variant="secondary" className="text-sm">
                    {articles.articlesCount} articles
                  </Badge>
                )}
              </div>
            </div>

            <Suspense fallback={<ArticlesListSkeleton />}>
              <ArticlesList initialData={articles} query={query} />
            </Suspense>

            <PaginationControls
              currentPage={currentPage}
              totalItems={articles.articlesCount}
              itemsPerPage={limit}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Popular Tags</h3>
                <TagSelector tags={tags} selectedTag={selectedTag} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

const ArticlesListSkeleton = () => (
  <div className="space-y-6">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-32 h-3" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="w-3/4 h-6" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-2/3 h-4" />
        </div>
      </div>
    ))}
  </div>
);

// Enable ISR for this page
export const revalidate = 300; // 5 minutes
