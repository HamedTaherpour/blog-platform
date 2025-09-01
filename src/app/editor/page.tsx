'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { ArticlesService } from '@/services';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, X } from 'lucide-react';
import type { Article } from '@/types';

const EditorPageContent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  // Load article for editing
  useEffect(() => {
    if (slug && token) {
      setIsLoading(true);
      ArticlesService.getArticle(slug, token)
        .then(response => {
          const article = response.article;
          
          // Check if user owns this article
          if (article.author.username !== user?.username) {
            setError('You can only edit your own articles');
            return;
          }

          setEditingArticle(article);
          setTitle(article.title);
          setDescription(article.description);
          setBody(article.body);
          setTags(article.tagList);
        })
        .catch(err => {
          setError(err instanceof Error ? err.message : 'Failed to load article');
        })
        .finally(() => setIsLoading(false));
    }
  }, [slug, token, user]);

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !body) {
      setError('Please fill in all required fields');
      return;
    }

    if (!token) {
      setError('You must be logged in to publish articles');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const articleData = {
        article: {
          title,
          description,
          body,
          tagList: tags
        }
      };

      if (editingArticle) {
        // Update existing article
        await ArticlesService.updateArticle(editingArticle.slug, articleData, token);
        router.push(`/article/${editingArticle.slug}`);
      } else {
        // Create new article
        const response = await ArticlesService.createArticle(articleData, token);
        router.push(`/article/${response.article.slug}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>
              {editingArticle ? 'Edit Article' : 'New Article'}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="title">Article Title *</Label>
                <Input
                  id="title"
                  placeholder="Article title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">What&apos;s this article about? *</Label>
                <Input
                  id="description"
                  placeholder="Article description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <Label htmlFor="body">Write your article (in markdown) *</Label>
                <Textarea
                  id="body"
                  placeholder="Write your article..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={isSubmitting}
                  required
                  rows={12}
                  className="font-mono"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Enter a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={isSubmitting || !tagInput.trim()}
                  >
                    Add Tag
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          disabled={isSubmitting}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !title || !description || !body}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingArticle ? 'Updating...' : 'Publishing...'}
                    </>
                  ) : (
                    editingArticle ? 'Update Article' : 'Publish Article'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

const EditorPage = () => {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </div>
      </MainLayout>
    }>
      <EditorPageContent />
    </Suspense>
  );
};

export default EditorPage;
