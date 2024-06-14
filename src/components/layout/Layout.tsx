import React from 'react';
import { Settings, Home, Package, ShoppingCart, Users } from 'lucide-react';

import { MenuItem } from './interfaces/MenuItem.interface';

import { cn } from '@/lib/utils';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const menuItems: MenuItem[] = [
  {
    code: 'dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="h- w-4" />
  },
  {
    code: 'contacts',
    title: 'Contacts',
    href: '/contacts',
    icon: <Users className="h-5 w-5" />
  },
  {
    code: 'selling',
    title: 'Vente',
    href: '/selling',
    icon: <Package className="h-5 w-5" />
  },
  {
    code: 'buying',
    title: 'Achat',
    href: '/buying',
    icon: <ShoppingCart className="h-5 w-5" />
  },
  {
    code: 'settings',
    title: 'Réglages',
    href: '/settings/general',
    icon: <Settings className="h-5 w-5" />
  }
];

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar menuItems={menuItems} />
        <div className="flex flex-col">
          <Header menuItems={menuItems} />
          <main className={cn(className, 'gap-4 p-4 lg:gap-6 lg:p-6')}>{children}</main>
        </div>
      </div>
    </div>
  );
};
