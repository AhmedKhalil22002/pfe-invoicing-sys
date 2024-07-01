import React from 'react';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { IMenuItem } from '@/pages/interfaces/MenuItem.interface';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  items: IMenuItem[];
}
//
export const Layout = ({ children, className, items}: LayoutProps) => {
  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden md:flex-cols-[220px_1fr] lg:flex-cols-[280px_1fr]">
      <Sidebar menuItems={items} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header menuItems={[]} />
        <main className={cn('flex-1 flex flex-col overflow-hidden', className)}>{children}</main>
      </div>
    </div>
  );
};
