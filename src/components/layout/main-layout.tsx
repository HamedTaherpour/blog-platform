import { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';
import PWARegistration from '@/components/common/pwa-registration';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PWARegistration />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
