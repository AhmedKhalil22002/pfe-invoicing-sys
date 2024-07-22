import { cn } from '@/lib/utils';
import React from 'react';
interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export const Container = ({ className, ...props }: ContainerProps) => (
  <div
    className={cn(
      'bg-white text-slate-950 shadow-sm dark:border-slate-100 dark:bg-inherit dark:text-slate-50',
      className
    )}
    {...props}
  />
);
