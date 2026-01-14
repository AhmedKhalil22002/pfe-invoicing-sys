import React from 'react';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { BreadcrumbContext, BreadcrumbRoute } from '../../context/BreadcrumbContext';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './sidebar/AppSidebar';
import { AppVersion } from './AppVersion';
import { IntroContext } from '@/context/IntroContext';
import { FooterContext } from '@/context/FooterContext';
import { PageHeader } from './PageHeader';
import { useMediaQuery } from '@/hooks/other/useMediaQuery';
import { Footer } from './Footer';

interface LayoutProps {
  className?: string;
  children: React.ReactNode;
}

export const Layout = ({ children, className }: LayoutProps) => {
  const [routes, setRoutes] = React.useState<BreadcrumbRoute[]>([]);
  const breadcrumbContext = {
    routes,
    setRoutes,
    clearRoutes: () => {
      setRoutes?.([]);
    }
  };

  const [content, setContent] = React.useState<React.ReactNode>(null);
  const footerContext = {
    content,
    setContent,
    clearContent: () => {
      setContent?.(null);
    }
  };

  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [floating, setFloating] = React.useState<React.ReactNode>(null);
  const introContext = {
    title,
    description,
    floating,
    setIntro: (title: string, description?: string) => {
      setTitle(title);
      setDescription(description || '');
    },
    setFloating,
    clearIntro: () => {
      setTitle('');
      setDescription('');
    },
    clearFloating: () => {
      setFloating(null);
    }
  };

  const isMobile = useMediaQuery('(max-width: 425px)');

  return (
    <IntroContext.Provider value={introContext}>
      <FooterContext.Provider value={footerContext}>
        <BreadcrumbContext.Provider value={breadcrumbContext}>
          <SidebarProvider className="flex flex-row flex-1 overflow-hidden">
            {/* Sidebar */}
            <AppSidebar />
            <SidebarInset>
              {/* Header , Main & Footer */}
              <Header />
              {(title || description) && (
                <PageHeader className={cn('py-5', isMobile ? 'px-4' : 'px-10')} />
              )}
              <div
                className={cn(
                  'flex flex-col flex-1 overflow-hidden',
                  isMobile ? 'px-2' : 'px-4',
                  className
                )}>
                {children}
              </div>
              {content && <Footer />}
              <AppVersion className="fixed bottom-0 left-0 z-50 p-2 text-xs" />
            </SidebarInset>
          </SidebarProvider>
        </BreadcrumbContext.Provider>
      </FooterContext.Provider>
    </IntroContext.Provider>
  );
};
