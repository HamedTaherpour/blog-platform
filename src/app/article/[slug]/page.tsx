import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ArticlesService, CommentsService } from '@/services';
import MainLayout from '@/components/layout/main-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import Link from 'next/link';
import CommentsList from '@/components/comments/comments-list';
import MarkdownContent from '@/components/common/markdown-content';
import ArticleActions from '@/components/articles/article-actions';
import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/common/seo-head';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const { article } = await ArticlesService.getArticle(resolvedParams.slug);
    
    return generateSEOMetadata({
      title: article.title,
      description: article.description,
      type: 'article',
      author: article.author.username,
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      tags: article.tagList,
      keywords: article.tagList,
    });
  } catch {
    return generateSEOMetadata({
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    });
  }
}

// Server Component with SSR
export default async function ArticlePage({ params }: ArticlePageProps) {
  try {
    const resolvedParams = await params;
    // Fetch article and comments on server side for SSR
    const [articleData, commentsData] = await Promise.allSettled([
      ArticlesService.getArticle(resolvedParams.slug),
      CommentsService.getComments(resolvedParams.slug),
    ]);

    if (articleData.status === 'rejected') {
      notFound();
    }

    const { article } = articleData.value;
    const comments = commentsData.status === 'fulfilled' ? commentsData.value : null;

    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Article Header */}
          <Card className="mb-8">
            <CardHeader className="pb-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {article.title}
              </h1>
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage 
                      src={article.author.image || undefined} 
                      alt={article.author.username} 
                    />
                    <AvatarFallback>
                      {article.author.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <Link
                      href={`/profile/${article.author.username}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {article.author.username}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                      {article.updatedAt !== article.createdAt && (
                        <span className="ml-2">
                          (updated {formatDistanceToNow(new Date(article.updatedAt), { addSuffix: true })})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <ArticleActions article={article} />
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Article Tags */}
              {article.tagList.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tagList.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Article Body */}
              <MarkdownContent content={article.body} />
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              Comments ({comments?.comments.length || 0})
            </h2>
            
            <Suspense fallback={<CommentsListSkeleton />}>
              <CommentsList 
                slug={resolvedParams.slug}
                initialData={comments}
              />
            </Suspense>
          </div>
        </div>
      </MainLayout>
    );
  } catch (error) {
    console.error('Error loading article:', error);
    notFound();
  }
}

const CommentsListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-32 h-3" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Enable ISR for this page
export const revalidate = 600; // 10 minutes
