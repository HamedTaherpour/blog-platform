import type { Article, Comment, User, Profile } from '@/types';

// Mock users data
export const mockUsers: User[] = [
  {
    email: "john@example.com",
    token: "jwt.token.here",
    username: "johndoe",
    bio: "Software developer passionate about React and Next.js",
    image: "https://i.pravatar.cc/150?img=1"
  },
  {
    email: "jane@example.com", 
    token: "jwt.token.here2",
    username: "janesmith",
    bio: "UX designer and frontend enthusiast",
    image: "https://i.pravatar.cc/150?img=2"
  },
  {
    email: "mike@example.com",
    token: "jwt.token.here3", 
    username: "mikebrown",
    bio: "Full-stack developer and tech blogger",
    image: "https://i.pravatar.cc/150?img=3"
  }
];

// Mock profiles data
export const mockProfiles: Profile[] = mockUsers.map(user => ({
  username: user.username,
  bio: user.bio,
  image: user.image,
  following: false
}));

// Mock articles data
export const mockArticles: Article[] = [
  {
    slug: "how-to-build-modern-react-apps",
    title: "How to Build Modern React Applications",
    description:
      "A comprehensive guide to building scalable React applications with the latest best practices",
    body: `# Building Modern React Applications

React has evolved significantly over the years, and building modern applications requires understanding the latest patterns and best practices.

## Key Concepts

### 1. Component Architecture
Modern React applications benefit from a well-thought-out component architecture. Here are some key principles:

- **Single Responsibility**: Each component should have one clear purpose
- **Composition over Inheritance**: Use composition to build complex UIs
- **Props Interface**: Define clear interfaces for your components

### 2. State Management
Choose the right state management solution for your needs:

- **useState**: For local component state
- **useReducer**: For complex state logic
- **Context API**: For sharing state across components
- **External Libraries**: Redux, Zustand, or Jotai for global state

### 3. Performance Optimization
- Use React.memo for preventing unnecessary re-renders
- Implement useMemo and useCallback for expensive computations
- Code splitting with React.lazy and Suspense

## Best Practices

1. Keep components small and focused
2. Use TypeScript for better development experience
3. Implement proper error boundaries
4. Write comprehensive tests
5. Follow accessibility guidelines

## Conclusion

Building modern React applications is an exciting journey. By following these practices, you'll create maintainable and scalable applications.`,
    tagList: ["react", "javascript", "frontend", "webdev"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    favorited: false,
    favoritesCount: 12,
    author: {
      username: "johndoe",
      bio: "Software developer passionate about React and Next.js",
      image: "https://i.pravatar.cc/150?img=1",
      following: false,
    },
  },
  {
    slug: "nextjs-server-side-rendering-guide",
    title: "Next.js Server-Side Rendering Complete Guide",
    description:
      "Learn everything about SSR in Next.js, from basics to advanced techniques",
    body: `# Next.js Server-Side Rendering Guide

Server-Side Rendering (SSR) is one of the most powerful features of Next.js, enabling better SEO and faster initial page loads.

## What is SSR?

Server-Side Rendering means that the HTML for your page is generated on the server for each request, rather than in the browser.

## Benefits of SSR

### 1. Better SEO
- Search engines can easily crawl and index your content
- Meta tags are properly set for social media sharing
- Improved search rankings

### 2. Faster Initial Load
- Users see content immediately
- No loading spinners for initial content
- Better perceived performance

### 3. Social Media Optimization
- Proper Open Graph tags
- Twitter cards work correctly
- Link previews show actual content

## Implementation in Next.js

\`\`\`tsx
// pages/article/[slug].tsx
export async function getServerSideProps(context) {
  const { slug } = context.params;
  
  // Fetch data on the server
  const article = await fetchArticle(slug);
  
  return {
    props: {
      article,
    },
  };
}

export default function ArticlePage({ article }) {
  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </div>
  );
}
\`\`\`

## App Router (Next.js 13+)

With the new App Router, SSR is even simpler:

\`\`\`tsx
// app/article/[slug]/page.tsx
async function ArticlePage({ params }) {
  const article = await fetchArticle(params.slug);
  
  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </div>
  );
}
\`\`\`

## Best Practices

1. **Cache Wisely**: Use appropriate caching strategies
2. **Optimize Data Fetching**: Fetch only what you need
3. **Handle Errors**: Implement proper error boundaries
4. **Performance Monitoring**: Track your SSR performance

## Conclusion

SSR in Next.js is a powerful tool that can significantly improve your application's performance and SEO. Use it wisely!`,
    tagList: ["nextjs", "ssr", "react", "performance"],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    favorited: true,
    favoritesCount: 8,
    author: {
      username: "janesmith",
      bio: "UX designer and frontend enthusiast",
      image: "https://i.pravatar.cc/150?img=2",
      following: true,
    },
  },
  {
    slug: "typescript-best-practices-2024",
    title: "TypeScript Best Practices for 2024",
    description:
      "Essential TypeScript patterns and practices every developer should know",
    body: `# TypeScript Best Practices for 2024

TypeScript continues to evolve, and staying up-to-date with best practices is crucial for writing maintainable code.

## Type Safety First

### 1. Strict Configuration
Always enable strict mode in your \`tsconfig.json\`:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
\`\`\`

### 2. Avoid \`any\`
Instead of using \`any\`, use more specific types:

\`\`\`typescript
// Bad
function processData(data: any) {
  return data.someProperty;
}

// Good
interface DataType {
  someProperty: string;
  otherProperty: number;
}

function processData(data: DataType) {
  return data.someProperty;
}
\`\`\`

## Advanced Type Patterns

### 1. Utility Types
Make use of TypeScript's built-in utility types:

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Create a type without password
type PublicUser = Omit<User, 'password'>;

// Create a type with only id and name
type UserSummary = Pick<User, 'id' | 'name'>;

// Make all properties optional
type PartialUser = Partial<User>;
\`\`\`

### 2. Conditional Types
Use conditional types for complex type logic:

\`\`\`typescript
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };

type StringResponse = ApiResponse<string>; // { message: string }
type DataResponse = ApiResponse<User>; // { data: User }
\`\`\`

## React + TypeScript

### 1. Component Props
Define clear interfaces for your component props:

\`\`\`typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  disabled = false, 
  onClick 
}) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
\`\`\`

### 2. Hooks with TypeScript
Type your custom hooks properly:

\`\`\`typescript
interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useApi<T>(url: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [url]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error };
}
\`\`\`

## Performance Tips

1. **Use \`const assertions\`** for better type inference
2. **Prefer interfaces over types** for object shapes
3. **Use generic constraints** to limit type parameters
4. **Enable incremental compilation** for faster builds

## Conclusion

TypeScript is a powerful tool that can significantly improve your development experience and code quality. Following these best practices will help you write more maintainable and robust applications.`,
    tagList: ["typescript", "javascript", "bestpractices", "webdev"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    favorited: false,
    favoritesCount: 15,
    author: {
      username: "mikebrown",
      bio: "Full-stack developer and tech blogger",
      image: "https://i.pravatar.cc/150?img=3",
      following: false,
    },
  },
  {
    slug: "css-grid-vs-flexbox-2024",
    title: "CSS Grid vs Flexbox: When to Use Which in 2024",
    description:
      "A practical guide to choosing between CSS Grid and Flexbox for your layouts",
    body: `# CSS Grid vs Flexbox: The Ultimate Guide

Both CSS Grid and Flexbox are powerful layout systems, but they serve different purposes. Let's explore when to use each.

## Flexbox: One-Dimensional Layouts

Flexbox is designed for one-dimensional layouts - either a row or a column.

### When to Use Flexbox

1. **Navigation bars**
2. **Button groups**
3. **Centering content**
4. **Distributing space between items**

### Flexbox Example

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
  list-style: none;
}
\`\`\`

## CSS Grid: Two-Dimensional Layouts

CSS Grid is designed for two-dimensional layouts - both rows and columns simultaneously.

### When to Use CSS Grid

1. **Page layouts**
2. **Card grids**
3. **Complex forms**
4. **Dashboard layouts**

### CSS Grid Example

\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
\`\`\`

## Combining Both

Often, the best approach is to use both together:

\`\`\`css
/* Grid for overall layout */
.page {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
}

/* Flexbox for component internals */
.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: auto;
}
\`\`\`

## Decision Framework

Ask yourself these questions:

1. **One or two dimensions?**
   - One dimension → Flexbox
   - Two dimensions → Grid

2. **Content-driven or layout-driven?**
   - Content-driven → Flexbox
   - Layout-driven → Grid

3. **Do you need precise control?**
   - Yes → Grid
   - No → Flexbox

## Browser Support

Both CSS Grid and Flexbox have excellent browser support in 2024:

- **Flexbox**: 98%+ browser support
- **CSS Grid**: 96%+ browser support

## Performance Considerations

- Both are highly optimized by browsers
- Grid can be more performant for complex layouts
- Flexbox is lighter for simple one-dimensional layouts

## Conclusion

Don't think of Grid and Flexbox as competing technologies. They complement each other perfectly. Use Grid for your overall page layout and Flexbox for component-level layouts.`,
    tagList: ["css", "grid", "flexbox", "layout", "webdev"],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    favorited: true,
    favoritesCount: 22,
    author: {
      username: "janesmith",
      bio: "UX designer and frontend enthusiast",
      image: "https://i.pravatar.cc/150?img=2",
      following: true,
    },
  },
  {
    slug: "web-performance-optimization-2024",
    title: "Web Performance Optimization Techniques for 2024",
    description:
      "Latest techniques and tools for optimizing web application performance",
    body: `# Web Performance Optimization in 2024

Performance is crucial for user experience and business success. Here are the latest techniques for optimizing web applications.

## Core Web Vitals

Google's Core Web Vitals are essential metrics to focus on:

### 1. Largest Contentful Paint (LCP)
- **Target**: Under 2.5 seconds
- **Optimization**: Optimize images, use CDN, implement lazy loading

### 2. First Input Delay (FID)
- **Target**: Under 100 milliseconds  
- **Optimization**: Minimize JavaScript execution time, use web workers

### 3. Cumulative Layout Shift (CLS)
- **Target**: Under 0.1
- **Optimization**: Set dimensions for images and videos, avoid dynamic content injection

## Image Optimization

Images often account for 60%+ of page weight:

### 1. Modern Formats
\`\`\`html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
\`\`\`

### 2. Responsive Images
\`\`\`html
<img 
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 480px) 100vw, (max-width: 800px) 50vw, 25vw"
  src="medium.jpg" 
  alt="Description"
>
\`\`\`

## JavaScript Optimization

### 1. Code Splitting
\`\`\`javascript
// Dynamic imports for code splitting
const LazyComponent = lazy(() => import('./LazyComponent'));

// Route-based splitting
const About = lazy(() => import('./pages/About'));
\`\`\`

### 2. Tree Shaking
\`\`\`javascript
// Import only what you need
import { debounce } from 'lodash/debounce';

// Instead of
import _ from 'lodash';
\`\`\`

### 3. Web Workers
\`\`\`javascript
// Offload heavy computations
const worker = new Worker('heavy-computation.js');
worker.postMessage(data);
worker.onmessage = (e) => {
  console.log('Result:', e.data);
};
\`\`\`

## CSS Optimization

### 1. Critical CSS
Extract and inline critical CSS for above-the-fold content:

\`\`\`html
<style>
  /* Critical CSS inline */
  .header { /* styles */ }
  .hero { /* styles */ }
</style>

<link rel="preload" href="non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
\`\`\`

### 2. CSS Containment
\`\`\`css
.component {
  contain: layout style paint;
}
\`\`\`

## Network Optimization

### 1. Resource Hints
\`\`\`html
<!-- DNS prefetch -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">

<!-- Preconnect -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Preload critical resources -->
<link rel="preload" href="critical-font.woff2" as="font" type="font/woff2" crossorigin>
\`\`\`

### 2. HTTP/2 and HTTP/3
- Enable HTTP/2 Push for critical resources
- Use HTTP/3 where available for better performance

## Caching Strategies

### 1. Service Workers
\`\`\`javascript
// Cache-first strategy for static assets
self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
\`\`\`

### 2. Browser Caching
\`\`\`
# .htaccess
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
\`\`\`

## Monitoring and Measurement

### 1. Performance APIs
\`\`\`javascript
// Measure custom metrics
performance.mark('component-start');
// ... component rendering
performance.mark('component-end');
performance.measure('component-render', 'component-start', 'component-end');

// Get the measurement
const measure = performance.getEntriesByName('component-render')[0];
console.log('Component render time:', measure.duration);
\`\`\`

### 2. Real User Monitoring (RUM)
\`\`\`javascript
// Web Vitals library
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
\`\`\`

## Tools and Testing

1. **Lighthouse**: Automated audits
2. **WebPageTest**: Detailed performance analysis
3. **Chrome DevTools**: Performance profiling
4. **Bundle Analyzer**: JavaScript bundle analysis

## Performance Budget

Set performance budgets for your team:

\`\`\`json
{
  "budget": [
    {
      "resourceSizes": [
        {"resourceType": "script", "budget": 170},
        {"resourceType": "total", "budget": 300}
      ]
    }
  ]
}
\`\`\`

## Conclusion

Web performance optimization is an ongoing process. Focus on measuring, optimizing, and monitoring. Remember that performance is a feature, not an afterthought.

Start with the biggest impact optimizations first, and always measure the results of your changes.`,
    tagList: ["performance", "optimization", "webdev", "lighthouse"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    favorited: false,
    favoritesCount: 18,
    author: {
      username: "mikebrown",
      bio: "Full-stack developer and tech blogger",
      image: "https://i.pravatar.cc/150?img=3",
      following: false,
    },
  },
  {
    slug: "react-server-components-2024",
    title: "React Server Components in 2024",
    description:
      "Understanding React Server Components and how to use them effectively",
    body: `# React Server Components (RSC)

React Server Components allow you to render components on the server and stream them to the client.  
They improve performance and reduce bundle size.`,
    tagList: ["react", "server-components", "frontend"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    favorited: true,
    favoritesCount: 25,
    author: {
      username: "sarah_dev",
      bio: "Frontend engineer, React enthusiast",
      image: "https://i.pravatar.cc/150?img=5",
      following: true,
    },
  },
  {
    slug: "ai-in-web-development",
    title: "AI in Web Development",
    description: "How AI tools are shaping modern frontend development",
    body: `# AI and Web Development

AI-powered tools can generate code snippets, optimize performance,  
and even assist in UI/UX design.`,
    tagList: ["ai", "webdev", "future"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    favorited: false,
    favoritesCount: 12,
    author: {
      username: "john_doe",
      bio: "JavaScript developer exploring AI",
      image: "https://i.pravatar.cc/150?img=8",
      following: false,
    },
  },
  {
    slug: "nextjs-14-features",
    title: "Top Features in Next.js 14",
    description: "A quick look at what's new in Next.js 14",
    body: `# Next.js 14

Some exciting features include:  
- Improved app directory  
- Faster builds  
- Enhanced server actions`,
    tagList: ["nextjs", "react", "javascript"],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    favorited: true,
    favoritesCount: 34,
    author: {
      username: "emily",
      bio: "Full-stack dev, loves Next.js",
      image: "https://i.pravatar.cc/150?img=12",
      following: false,
    },
  },
];

// Mock comments data
export const mockComments: { [articleSlug: string]: Comment[] } = {
  "how-to-build-modern-react-apps": [
    {
      id: 1,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      body: "Great article! Really helpful insights on React architecture. I especially liked the section about component composition.",
      author: {
        username: "janesmith",
        bio: "UX designer and frontend enthusiast",
        image: "https://i.pravatar.cc/150?img=2",
        following: true
      }
    },
    {
      id: 2,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      body: "Thanks for sharing this! The state management section was particularly useful. Have you considered covering Redux Toolkit in a future post?",
      author: {
        username: "mikebrown",
        bio: "Full-stack developer and tech blogger",
        image: "https://i.pravatar.cc/150?img=3",
        following: false
      }
    }
  ],
  "nextjs-server-side-rendering-guide": [
    {
      id: 3,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      body: "Excellent guide! The App Router examples are very clear. This helped me understand the differences between the old and new approaches.",
      author: {
        username: "johndoe",
        bio: "Software developer passionate about React and Next.js",
        image: "https://i.pravatar.cc/150?img=1",
        following: false
      }
    }
  ],
  "typescript-best-practices-2024": [
    {
      id: 4,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      body: "Love the utility types section! I've been using Omit and Pick a lot lately. The conditional types example is also very helpful.",
      author: {
        username: "janesmith",
        bio: "UX designer and frontend enthusiast",
        image: "https://i.pravatar.cc/150?img=2",
        following: true
      }
    },
    {
      id: 5,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      body: "Great post! The React + TypeScript section is gold. I'm definitely going to implement these patterns in my current project.",
      author: {
        username: "johndoe",
        bio: "Software developer passionate about React and Next.js",
        image: "https://i.pravatar.cc/150?img=1",
        following: false
      }
    }
  ]
};

// Popular tags
export const mockTags: string[] = [
  "react", "javascript", "typescript", "nextjs", "css", "webdev", 
  "frontend", "backend", "fullstack", "nodejs", "performance", 
  "optimization", "ssr", "seo", "pwa", "testing", "bestpractices",
  "architecture", "design", "ux", "ui", "responsive", "mobile",
  "api", "database", "security", "deployment", "devops", "git"
];

// Helper function to get random items from array
export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to generate random slug
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
