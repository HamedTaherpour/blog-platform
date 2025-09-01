'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw, Home, BookOpen } from 'lucide-react';
import Link from 'next/link';

const OfflinePage = () => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleRetry = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'RETRY_FAILED_REQUESTS' });
    }
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <WifiOff className={`w-8 h-8 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isOnline ? 'Back Online!' : 'You\'re Offline'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isOnline 
              ? 'Your connection has been restored. You can now browse the latest content.'
              : 'It looks like you\'re not connected to the internet. Don\'t worry, you can still browse cached articles.'
            }
          </p>
          
          {isOnline ? (
            <div className="space-y-3">
              <Button onClick={handleRefresh} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
              <Button variant="outline" onClick={handleRetry} className="w-full">
                Return to Previous Page
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link href="/" className="block">
                <Button className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Home
                </Button>
              </Link>
              <Button variant="outline" onClick={handleRetry} className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Cached Articles
              </Button>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Connection Status: 
              <span className={`ml-1 font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflinePage;
