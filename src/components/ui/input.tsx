import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

interface ShimmerProps {
  className?: string;
}
export const Shimmer = ({ className }: ShimmerProps) => (
  <Input className={cn('animate-pulse bg-gray-300 rounded w-full disabled:cursor-auto', className)} disabled></Input>
);

interface InputPropsShimmer extends InputProps {
  isPending: boolean;
}

export const InputShimmer = ({ className,isPending,...props }: InputPropsShimmer) => {
  if (isPending) {
    return <Shimmer className={className} />
  }
  return <Input className={className}  {...props}/>
};


export { Input };
