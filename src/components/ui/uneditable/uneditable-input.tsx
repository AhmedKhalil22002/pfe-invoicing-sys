import { Label } from '../label';
import { cn } from '@/lib/utils';
import { Skeleton } from '../skeleton';

interface UneditableInputProps {
  className?: string;
  value?: string | React.ReactNode;
  isPending?: boolean;
}

export const UneditableInput = ({ className, value, isPending }: UneditableInputProps) => {
  if (!isPending)
    return (
      <Label
        className={cn(
          'flex items-center h-10 w-full font-light text-sm mt-1 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2',
          className
        )}>
        {value || ''}
      </Label>
    );
  else return <Skeleton className="w-full h-11 rounded-md" />;
};
