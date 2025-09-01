import { NextRequest, NextResponse } from "next/server";
import {
  mockArticles,
  mockComments,
  mockTags,
  mockUsers,
  mockProfiles,
} from "@/lib/mock-data";
import type {
  ArticlesResponse,
  ArticleResponse,
  CommentsResponse,
  TagsResponse,
  UserResponse,
  ProfileResponse,
} from "@/types";

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to paginate results
function paginateResults<T>(items: T[], limit: number, offset: number) {
  const startIndex = offset;
  const endIndex = startIndex + limit;
  
  return {
    items: items.slice(startIndex, endIndex),
    total: items.length,
  };
}

// Helper function to filter articles by query parameters
function filterArticles(
  articles: typeof mockArticles,
  searchParams: URLSearchParams
) {
  let filtered = [...articles];

  const tag = searchParams.get("tag");
  const author = searchParams.get("author");
  const favorited = searchParams.get("favorited");

  if (tag) {
    filtered = filtered.filter((article) =>
      article.tagList.find((_tag) => _tag === tag)
    );    
  }

  if (author) {
    filtered = filtered.filter((article) => article.author.username === author);
  }

  if (favorited) {
    filtered = filtered.filter(
      (article) => article.favorited && article.author.username === favorited
    );
  }

  // Sort by creation date (newest first)
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return filtered;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // Simulate API delay
  await delay(Math.random() * 500 + 200);

  const { path: pathArray } = await params;
  const path = pathArray.join("/");
  const searchParams = request.nextUrl.searchParams;

  try {
    // Articles endpoints
    if (path === "articles") {
      const limit = parseInt(searchParams.get("limit") || "20");
      const offset = parseInt(searchParams.get("offset") || "0");

      const filteredArticles = filterArticles(mockArticles, searchParams);
      const { items, total } = paginateResults(filteredArticles, limit, offset);
      
      const response: ArticlesResponse = {
        articles: items,
        articlesCount: total,
      };

      return NextResponse.json(response);
    }

    // Single article endpoint
    if (path.startsWith("articles/") && !path.includes("/comments")) {
      const slug = path.replace("articles/", "");
      const article = mockArticles.find((a) => a.slug === slug);

      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }

      const response: ArticleResponse = { article };
      return NextResponse.json(response);
    }

    // Comments endpoints
    if (path.includes("/comments")) {
      const slug = path.split("/")[1];
      const comments = mockComments[slug] || [];

      const response: CommentsResponse = { comments };
      return NextResponse.json(response);
    }

    // Tags endpoint
    if (path === "tags") {
      const response: TagsResponse = { tags: mockTags };
      return NextResponse.json(response);
    }

    // User endpoints
    if (path === "user") {
      // Return mock current user
      const response: UserResponse = { user: mockUsers[0] };
      return NextResponse.json(response);
    }

    // Profile endpoints
    if (path.startsWith("profiles/")) {
      const username = path.replace("profiles/", "").replace("/follow", "");
      const profile = mockProfiles.find((p) => p.username === username);

      if (!profile) {
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        );
      }

      const response: ProfileResponse = { profile };
      return NextResponse.json(response);
    }

    // Feed endpoint (authenticated articles)
    if (path === "articles/feed") {
      const limit = parseInt(searchParams.get("limit") || "20");
      const offset = parseInt(searchParams.get("offset") || "0");

      // Return articles from followed users
      const feedArticles = mockArticles.filter(
        (article) => article.author.following
      );

      const { items, total } = paginateResults(feedArticles, limit, offset);

      const response: ArticlesResponse = {
        articles: items,
        articlesCount: total,
      };

      return NextResponse.json(response);
    }

    // Default 404 for unknown endpoints
    return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  await delay(Math.random() * 300 + 100);

  const { path: pathArray } = await params;
  const path = pathArray.join("/");

  try {
    // Login endpoint
    if (path === "users/login") {
      const body = await request.json();
      const { email } = body.user;

      const user = mockUsers.find((u) => u.email === email);
      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const response: UserResponse = { user };
      return NextResponse.json(response);
    }

    // Register endpoint
    if (path === "users") {
      const body = await request.json();
      const { username, email } = body.user;

      // Simulate user creation
      const newUser = {
        email,
        username,
        token: "jwt.token.new",
        bio: "",
        image: null,
      };

      const response: UserResponse = { user: newUser };
      return NextResponse.json(response);
    }

    // Create article
    if (path === "articles") {
      const body = await request.json();
      const { title, description, body: articleBody, tagList } = body.article;

      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");

      const newArticle = {
        slug,
        title,
        description,
        body: articleBody,
        tagList: tagList || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorited: false,
        favoritesCount: 0,
        author: {
          ...mockUsers[0],
          following: false,
        },
      };

      // Add to mock data (in real app, this would be persisted)
      mockArticles.unshift(newArticle);

      const response: ArticleResponse = { article: newArticle };
      return NextResponse.json(response);
    }

    // Create comment
    if (path.includes("/comments") && !path.includes("/comments/")) {
      const slug = path.split("/")[1];
      const body = await request.json();

      const newComment = {
        id: Date.now(), // Simple ID generation
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        body: body.comment.body,
        author: {
          ...mockUsers[0],
          following: false,
        },
      };

      // Add to mock data
      if (!mockComments[slug]) {
        mockComments[slug] = [];
      }
      mockComments[slug].push(newComment);

      return NextResponse.json({ comment: newComment });
    }

    // Favorite/unfavorite article
    if (path.includes("/favorite")) {
      const slug = path.split("/")[1];
      const article = mockArticles.find((a) => a.slug === slug);

      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }

      // Toggle favorite status
      article.favorited = !article.favorited;
      article.favoritesCount += article.favorited ? 1 : -1;

      const response: ArticleResponse = { article };
      return NextResponse.json(response);
    }

    // Follow/unfollow user
    if (path.includes("/follow")) {
      const username = path.split("/")[1];
      const profile = mockProfiles.find((p) => p.username === username);

      if (!profile) {
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        );
      }

      profile.following = !profile.following;

      const response: ProfileResponse = { profile };
      return NextResponse.json(response);
    }

    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  await delay(Math.random() * 300 + 100);

  const { path: pathArray } = await params;
  const path = pathArray.join("/");

  try {
    // Update article
    if (path.startsWith("articles/")) {
      const slug = path.replace("articles/", "");
      const body = await request.json();

      const articleIndex = mockArticles.findIndex((a) => a.slug === slug);
      if (articleIndex === -1) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }

      // Update article
      const updatedArticle = {
        ...mockArticles[articleIndex],
        ...body.article,
        updatedAt: new Date().toISOString(),
      };

      mockArticles[articleIndex] = updatedArticle;

      const response: ArticleResponse = { article: updatedArticle };
      return NextResponse.json(response);
    }

    // Update user
    if (path === "user") {
      const body = await request.json();
      const updatedUser = {
        ...mockUsers[0],
        ...body.user,
      };

      const response: UserResponse = { user: updatedUser };
      return NextResponse.json(response);
    }

    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  await delay(Math.random() * 200 + 100);

  const { path: pathArray } = await params;
  const path = pathArray.join("/");

  try {
    // Delete article
    if (
      path.startsWith("articles/") &&
      !path.includes("/comments/") &&
      !path.includes("/favorite")
    ) {
      const slug = path.replace("articles/", "");
      const articleIndex = mockArticles.findIndex((a) => a.slug === slug);

      if (articleIndex === -1) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }

      mockArticles.splice(articleIndex, 1);
      return NextResponse.json({ message: "Article deleted" }, { status: 200 });
    }

    // Delete comment
    if (path.includes("/comments/")) {
      const [, slug, , commentId] = path.split("/");
      const comments = mockComments[slug] || [];
      const commentIndex = comments.findIndex(
        (c) => c.id === parseInt(commentId)
      );

      if (commentIndex === -1) {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 }
        );
      }

      comments.splice(commentIndex, 1);
      return NextResponse.json({ message: "Comment deleted" }, { status: 200 });
    }

    // Unfollow user
    if (path.includes("/follow")) {
      const username = path.split("/")[1];
      const profile = mockProfiles.find((p) => p.username === username);

      if (!profile) {
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        );
      }

      profile.following = false;

      const response: ProfileResponse = { profile };
      return NextResponse.json(response);
    }

    // Unfavorite article
    if (path.includes("/favorite")) {
      const slug = path.split("/")[1];
      const article = mockArticles.find((a) => a.slug === slug);

      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }

      article.favorited = false;
      article.favoritesCount = Math.max(0, article.favoritesCount - 1);

      const response: ArticleResponse = { article };
      return NextResponse.json(response);
    }

    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
