import React from 'react';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { IMenuItem } from '@/components/layout/interfaces/MenuItem.interface';
import { BreadcrumbContext, BreadcrumbRoute } from './BreadcrumbContext';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './sidebar/AppSidebar';
import { AppVersion } from './AppVersion';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  const [routes, setRoutes] = React.useState<BreadcrumbRoute[]>([]);
  const context = {
    routes,
    setRoutes
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <BreadcrumbContext.Provider value={context}>
          <div
            className={cn(
              'flex min-h-screen max-h-screen overflow-hidden md:flex-cols-[220px_1fr] lg:flex-cols-[280px_1fr]',
              'bg-gradient-to-r from-white to-zinc-200',
              'dark:bg-gradient-to-r dark:from-zinc-950 dark:to-zinc-800'
            )}>
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className={cn('flex-1 flex flex-col overflow-hidden', className)}>
                {children}
              </main>
            </div>
          </div>
          <AppVersion className="fixed bottom-0 right-0 z-50 p-2 text-xs" />
        </BreadcrumbContext.Provider>
      </SidebarInset>
    </SidebarProvider>
  );
};
