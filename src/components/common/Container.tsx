import { cn } from '@/lib/utils';
import React from 'react';
interface ContainerProps {
  className?: string;
  children?: React.ReactNode;
}

export const Container = ({ className, ...props }: ContainerProps) => (
  <div className={cn(className)} {...props} />
);
