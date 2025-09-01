# Blog Platform

A modern, responsive blog platform built with Next.js, TypeScript, Tailwind CSS, with built-in mock API. Features server-side rendering (SSR), PWA capabilities, offline functionality, and optimized performance.

## 🚀 Features

### Mock API Endpoints
The application includes a complete mock API with the following endpoints:

- **Authentication**: `POST /api/users/login`, `POST /api/users`
- **Articles**: `GET /api/articles`, `POST /api/articles`, `PUT /api/articles/:slug`, `DELETE /api/articles/:slug`
- **Comments**: `GET /api/articles/:slug/comments`, `POST /api/articles/:slug/comments`, `DELETE /api/articles/:slug/comments/:id`
- **Tags**: `GET /api/tags`
- **Profiles**: `GET /api/profiles/:username`
- **Favorites**: `POST /api/articles/:slug/favorite`, `DELETE /api/articles/:slug/favorite`

All endpoints return realistic mock data and simulate real API behavior including delays and error handling.

- **Server-Side Rendering (SSR)** - Pages are rendered on the server for better SEO and performance
- **Progressive Web App (PWA)** - Full offline functionality with smart caching
- **Offline-First** - Articles and content cached for offline viewing
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Article Management** - Browse, read, and interact with articles
- **Comments System** - Read and manage comments on articles
- **Tag-based Filtering** - Filter articles by tags
- **Pagination** - Efficient navigation through large article lists
- **Performance Optimized** - Built for excellent Lighthouse scores
- **Built-in Mock API** - Complete CRUD operations with mock data

## 🏗️ Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (mock data)
│   ├── article/           # Article detail pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── error.tsx         # Global error UI
│   └── not-found.tsx     # 404 page
├── components/            # Reusable UI components
│   ├── articles/         # Article-related components
│   ├── comments/         # Comment-related components
│   ├── common/           # Shared components
│   ├── layout/           # Layout components
│   └── ui/               # Base UI components (shadcn)
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── services/             # API service layer
└── types/                # TypeScript type definitions
```

### Technical Architecture

#### 1. **Service Layer Pattern**
- Centralized API communication through service classes
- Mock data integration with realistic API simulation
- Clean separation between UI and data fetching
- Proper error handling and type safety

#### 2. **Server-Side Rendering**
- Pages are rendered on the server using Next.js App Router
- Data is fetched at build time and on each request
- Improved SEO and initial page load performance

#### 3. **Component Architecture**
- Modular, reusable components
- Clear separation of concerns
- Proper encapsulation and composition

#### 4. **State Management**
- Server state managed through SSR and ISR
- Client state handled with React hooks
- No unnecessary global state management

#### 5. **Performance Optimizations**
- Image optimization
- Code splitting and lazy loading
- Efficient caching strategies
- PWA with service worker

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables (Optional)**
   Create a `.env.local` file in the project root if you want to customize:
   ```env
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Environment
   NODE_ENV=development
   ```
   
   **Note**: The app works out of the box with built-in mock API. No external API configuration needed.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📱 PWA & Offline Functionality

This application is a fully functional Progressive Web App (PWA) with comprehensive offline support:

### Features
- **Installable**: Can be installed on mobile and desktop devices
- **Offline Reading**: Articles are cached for offline viewing
- **Smart Caching**: Network-first strategy with cache fallback
- **Service Worker**: Handles caching and offline functionality
- **Background Sync**: Updates content when connection is restored

### How it Works
1. **Initial Load**: Articles are fetched from mock API and cached locally
2. **Offline Detection**: App automatically detects when you go offline
3. **Cache Fallback**: Shows cached content when network requests fail
4. **Online Restoration**: Syncs with mock data when connection is restored

### Testing Offline Mode
1. Build and run the production version: `npm run build && npm start`
2. Open DevTools → Network tab → Set to "Offline"
3. Navigate through the app - it should work seamlessly with cached content

### Cache Management
- Articles: 2 hours cache duration
- Tags: 24 hours cache duration
- Static assets: 30 days cache duration
- Images: 30 days cache duration

## 🎨 Design System

The application uses a centralized design system defined in `globals.css`:

- **Colors**: Modern blue theme with light/dark mode support
- **Typography**: Inter font family for readability
- **Spacing**: Consistent spacing scale
- **Components**: Shadcn/ui component library
- **Responsive**: Mobile-first approach

## 🔧 Technical Decisions

### Why Next.js App Router?
- Native SSR support
- Improved performance with React Server Components
- Better developer experience
- Built-in optimizations

### Why Service Layer Pattern?
- Clean separation of concerns
- Mock data integration for development
- Easier testing and maintenance
- Consistent error handling
- Type safety across the application

### Why SSR over CSR?
- Better SEO performance
- Faster initial page loads
- Improved user experience
- Better accessibility

### Why PWA?
- Offline functionality
- App-like experience
- Better performance
- Enhanced user engagement

## 📊 Performance

The application is optimized for excellent performance:

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized LCP, FID, and CLS
- **Bundle Size**: Minimized through code splitting
- **Caching**: Aggressive caching for static assets
- **Images**: Optimized with Next.js Image component

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🚀 Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS**
- **Docker**

## 📱 PWA Features

- **Offline Support**: Articles are cached for offline reading
- **App Installation**: Can be installed as a native app
- **Smart Caching**: Intelligent cache management for optimal performance
- **Background Sync**: Updates content when connection is restored

## 🔐 Security

- **Input Sanitization**: XSS protection
- **Headers**: Security headers implemented
- **Mock Data**: Safe development environment
- **Type Safety**: TypeScript for runtime safety

## 📈 Monitoring

The application includes:

- **Error Boundaries**: Graceful error handling
- **Loading States**: Proper loading indicators
- **Error Logging**: Console error tracking
- **Performance Monitoring**: Ready for analytics integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
