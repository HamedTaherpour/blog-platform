import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { Comment } from '@/types';

interface CommentCardProps {
  comment: Comment;
  onDelete?: (commentId: number) => void;
  canDelete?: boolean;
}

const CommentCard = ({ comment, onDelete, canDelete = false }: CommentCardProps) => {
  const handleDelete = () => {
    if (onDelete && canDelete) {
      onDelete(comment.id);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage 
                src={comment.author.image || undefined} 
                alt={comment.author.username} 
              />
              <AvatarFallback>
                {comment.author.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <Link
                href={`/profile/${comment.author.username}`}
                className="font-medium text-primary hover:underline"
              >
                {comment.author.username}
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                {comment.updatedAt !== comment.createdAt && (
                  <span className="ml-2">
                    (edited)
                  </span>
                )}
              </p>
            </div>
          </div>
          
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="whitespace-pre-wrap">{comment.body}</p>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
