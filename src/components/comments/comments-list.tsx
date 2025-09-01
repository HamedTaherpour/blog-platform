'use client';

import { useComments } from '@/hooks';
import CommentCard from './comment-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { CommentsResponse } from '@/types';

interface CommentsListProps {
  slug: string;
  initialData?: CommentsResponse | null;
  token?: string;
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

const CommentsList = ({ slug, initialData, token }: CommentsListProps) => {
  const { data, isLoading, error } = useComments(slug, { 
    initialData: initialData || undefined,
    token 
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load comments: {error}</p>
      </div>
    );
  }

  if (isLoading && !data) {
    return <CommentsListSkeleton />;
  }

  if (!data || data.comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No comments yet. Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.comments.map((comment) => (
        <CommentCard 
          key={comment.id} 
          comment={comment}
          // TODO: Add delete functionality and permission check
          canDelete={false}
        />
      ))}
    </div>
  );
};

export default CommentsList;
