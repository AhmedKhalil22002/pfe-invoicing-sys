import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

interface LabelPropsShimmer
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  className?: string;
  isPending: boolean;
}

export const LabelShimmer = ({ className, isPending, ...props }: LabelPropsShimmer) => {
  if (isPending) {
    return   <Label
    className={cn(
      'animate-pulse rounded w-full disabled:cursor-auto opacity-10',
      className
    )} {...props} ></Label>
  }
  return <Label className={className} {...props} />;
};

export { Label };
