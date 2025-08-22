import React from 'react';
import { BreadcrumbCommon } from '../shared';
import { cn } from '@/lib/utils';
import { ModeToggle } from '../shared/ModeToggle';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import { SidebarTrigger } from '../ui/sidebar';

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
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
      </div>
    </header>
  );
};
