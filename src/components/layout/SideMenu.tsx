import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { IMenuItem } from '../../pages/interfaces/MenuItem.interface';
import { useRouter } from 'next/router';

interface SideMenuProps {
  className?: string;
  menuItems: IMenuItem[];
}

export const SideMenu = ({ className, menuItems }: SideMenuProps) => {
  const router = useRouter();
  return (
    <div className={cn(className, 'overflow-hidden')}>
        {menuItems.map((menu, index) => (
          <div key={index}>
            <div className="grid w-full max-w-6xl gap-2 my-5">
              <h1 className="text-xl font-semibold text-left">{menu.title}</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-5 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
              <nav className="grid gap-4 text-sm text-muted-foreground">
                {menuItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={menu?.href || '/'}
                    className={
                      item.href === router.asPath ? 'font-semibold text-primary underline' : ''
                    }>
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        ))}
      </div>
  );
};
