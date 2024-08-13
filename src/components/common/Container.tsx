import { cn } from '@/lib/utils';
import React from 'react';
interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export const Container = ({ className, ...props }: ContainerProps) => (
  <div
    className={cn('bg-slate-50 text-slate-800 dark:bg-slate-800 dark:text-slate-50', className)}
    {...props}
  />
);
