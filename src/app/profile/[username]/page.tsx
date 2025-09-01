import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ProfilesService, ArticlesService } from '@/services';
import MainLayout from '@/components/layout/main-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Edit } from 'lucide-react';
import Link from 'next/link';
import ArticlesList from '@/components/articles/articles-list';
import type { Metadata } from 'next';

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const { profile } = await ProfilesService.getProfile(resolvedParams.username);
    
    return {
      title: `${profile.username} | Conduit`,
      description: profile.bio || `${profile.username}'s profile on Conduit`,
      openGraph: {
        title: `${profile.username}`,
        description: profile.bio || `${profile.username}'s profile on Conduit`,
        type: 'profile',
        images: profile.image ? [{ url: profile.image }] : undefined,
      },
    };
  } catch {
    return {
      title: 'Profile Not Found | Conduit',
      description: 'The requested profile could not be found.',
    };
  }
}

// Server Component with SSR
export default async function ProfilePage({ params }: ProfilePageProps) {
  try {
    const resolvedParams = await params;
    
    // Fetch profile and user's articles on server side for SSR
    const [profileData, articlesData] = await Promise.allSettled([
      ProfilesService.getProfile(resolvedParams.username),
      ArticlesService.getArticles({ author: resolvedParams.username, limit: 20 }),
    ]);

    if (profileData.status === 'rejected') {
      notFound();
    }

    const { profile } = profileData.value;
    const articles = articlesData.status === 'fulfilled' ? articlesData.value : null;

    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage 
                    src={profile.image || undefined} 
                    alt={profile.username}
                  />
                  <AvatarFallback className="text-2xl">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">{profile.username}</h1>
                  {profile.bio && (
                    <p className="text-muted-foreground max-w-md">
                      {profile.bio}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant={profile.following ? "default" : "outline"}
                    className="min-w-[120px]"
                  >
                    {profile.following ? 'Following' : 'Follow'}
                  </Button>
                  
                  {/* Show edit button if viewing own profile */}
                  <Button variant="outline" asChild>
                    <Link href="/settings">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Stats */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {articles?.articlesCount || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Articles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {articles?.articles.reduce((sum, article) => sum + article.favoritesCount, 0) || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Favorites</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {profile.following ? '1' : '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles Tabs */}
          <Tabs defaultValue="articles" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="articles">My Articles</TabsTrigger>
              <TabsTrigger value="favorited">Favorited Articles</TabsTrigger>
            </TabsList>
            
            <TabsContent value="articles" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Articles by {profile.username}
                </h2>
                <Badge variant="secondary">
                  {articles?.articlesCount || 0} articles
                </Badge>
              </div>
              
              <Suspense fallback={<ArticlesListSkeleton />}>
                {articles ? (
                  <ArticlesList 
                    initialData={articles}
                    query={{ author: profile.username }}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Failed to load articles</p>
                  </div>
                )}
              </Suspense>
            </TabsContent>
            
            <TabsContent value="favorited" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Favorited by {profile.username}
                </h2>
              </div>
              
              <Suspense fallback={<ArticlesListSkeleton />}>
                <ArticlesList 
                  query={{ favorited: profile.username }}
                />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    );
  } catch (error) {
    console.error('Error loading profile:', error);
    notFound();
  }
}

const ArticlesListSkeleton = () => (
  <div className="space-y-6">
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
            <Skeleton className="w-3/4 h-6" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
