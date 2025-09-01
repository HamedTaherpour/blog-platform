'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Heart, MessageCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useFavorite } from '@/hooks/use-favorite';
import { ArticlesService } from '@/services';
import type { Article } from '@/types';

interface ArticleActionsProps {
  article: Article;
}

const ArticleActions = ({ article }: ArticleActionsProps) => {
  const [isFavorited, setIsFavorited] = useState(article.favorited);
  const [favCount, setFavCount] = useState(article.favoritesCount);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const { toggleFavorite, isLoading: isFavoriteLoading } = useFavorite({
    onSuccess: () => {
      // Success feedback
    },
    onError: (error) => {
      console.error('Favorite error:', error);
    }
  });

  const isOwner = isAuthenticated && user?.username === article.author.username;

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const newFavorited = await toggleFavorite(article.slug, isFavorited);
    const newCount = newFavorited ? favCount + 1 : Math.max(0, favCount - 1);
    
    setIsFavorited(newFavorited);
    setFavCount(newCount);
  };

  const handleDelete = async () => {
    if (!isOwner || !token) return;

    setIsDeleting(true);
    try {
      await ArticlesService.deleteArticle(article.slug, token);
      router.push('/');
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isFavorited ? 'default' : 'outline'}
        size="sm"
        onClick={handleFavoriteClick}
        disabled={isFavoriteLoading}
      >
        {isFavoriteLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
        )}
        {favCount}
      </Button>
      
      <Button variant="outline" size="sm">
        <MessageCircle className="w-4 h-4 mr-2" />
        Comments
      </Button>
      
      {isOwner && (
        <>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/editor?slug=${article.slug}`}>
              <Edit className="w-4 h-4" />
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isDeleting}>
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Article</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{article.title}&quot;? 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default ArticleActions;
