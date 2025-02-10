import React from 'react';
import { useRouter } from 'next/router';
import { BreadcrumbCommon } from '../common';
import { cn } from '@/lib/utils';
import { ModeToggle } from '../common/ModeToggle';
import { useBreadcrumb } from './BreadcrumbContext';
import { UserDropdown } from './UserDropdown';
import { SidebarTrigger } from '../ui/sidebar';

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const router = useRouter();
  const { routes } = useBreadcrumb();

  return (
    <header
      className={cn(
        'flex h-14 items-center gap-2 border-b px-4 lg:h-[60px] lg:px-6 w-full',
        className
      )}>
      <SidebarTrigger />
      <BreadcrumbCommon hierarchy={routes} />
      <div className="flex justify-center items-center gap-4 ml-auto">
        <ModeToggle />
        <UserDropdown />
      </div>
    </header>
  );
};
