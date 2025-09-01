import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { FileX, Home } from 'lucide-react';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <FileX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
          
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go back home
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;
