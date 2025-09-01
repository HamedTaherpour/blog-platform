'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { useFavorite } from '@/hooks/use-favorite';
import { useAuth } from '@/contexts/auth-context';
import type { ArticlePreview } from '@/types';

interface ArticleCardProps {
  article: ArticlePreview;
  onFavoriteChange?: (slug: string, favorited: boolean, newCount: number) => void;
}

const ArticleCard = ({ article, onFavoriteChange }: ArticleCardProps) => {
  const {
    slug,
    title,
    description,
    author,
    createdAt,
    tagList,
    favorited,
    favoritesCount,
  } = article;

  const [isFavorited, setIsFavorited] = useState(favorited);
  const [favCount, setFavCount] = useState(favoritesCount);
  const { isAuthenticated } = useAuth();
  
  const { toggleFavorite, isLoading } = useFavorite({
    onSuccess: () => {
      // Success feedback could be added here if needed
    },
    onError: (error) => {
      console.error('Favorite error:', error);
      // Could show toast notification here
    }
  });

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Could redirect to login or show message
      return;
    }

    const newFavorited = await toggleFavorite(slug, isFavorited);
    const newCount = newFavorited ? favCount + 1 : Math.max(0, favCount - 1);
    
    setIsFavorited(newFavorited);
    setFavCount(newCount);
    
    onFavoriteChange?.(slug, newFavorited, newCount);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="w-8 h-8">
              <AvatarImage src={author.image || undefined} alt={author.username} />
              <AvatarFallback>
                {author.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <Link
                href={`/profile/${author.username}`}
                className="font-medium text-primary hover:underline"
              >
                {author.username}
              </Link>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          <Button
            variant={isFavorited ? 'default' : 'outline'}
            size="sm"
            className="shrink-0"
            onClick={handleFavoriteClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Heart className={`w-4 h-4 mr-1 ${isFavorited ? 'fill-current' : ''}`} />
            )}
            {favCount}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div>
            <Link href={`/article/${slug}`}>
              <h2 className="text-xl font-bold hover:text-primary transition-colors line-clamp-2">
                {title}
              </h2>
            </Link>
            <p className="text-muted-foreground mt-2 line-clamp-3">
              {description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <Link
              href={`/article/${slug}`}
              className="text-sm text-primary hover:underline"
            >
              Read more...
            </Link>
            
            {tagList.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tagList.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {tagList.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{tagList.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
