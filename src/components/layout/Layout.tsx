import React from 'react';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { IMenuItem } from '@/components/layout/interfaces/MenuItem.interface';
import { BreadcrumbContext, BreadcrumbRoute } from './BreadcrumbContext';
import { Inter } from 'next/font/google';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  items: IMenuItem[];
}
const inter = Inter({ subsets: ['latin'] });

export const Layout = ({ children, className, items }: LayoutProps) => {
  const [routes, setRoutes] = React.useState<BreadcrumbRoute[]>([]);
  const context = {
    routes,
    setRoutes
  };
  return (
    <BreadcrumbContext.Provider value={context}>
      <div
        className="flex min-h-screen max-h-screen overflow-hidden md:flex-cols-[220px_1fr] lg:flex-cols-[280px_1fr] bg-slate-100 dark:bg-slate-800"
        style={{ fontFamily: inter.style.fontFamily }}>
        <Sidebar menuItems={items} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header menuItems={items} />
          <main className={cn('flex-1 flex flex-col overflow-hidden', className)}>{children}</main>
        </div>
      </div>
    </BreadcrumbContext.Provider>
  );
};
