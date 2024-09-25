import React from 'react';
import { cn } from '@/lib/utils';
import { DATE_FORMAT } from '@/types/enums/date-formats';
import { Input } from '../ui/input';
import { format } from 'date-fns';

interface SequenceInputProps {
  className?: string;
  prefix?: string;
  dateFormat?: DATE_FORMAT;
  value?: number;
  loading?: boolean;
}

export const SequenceInput: React.FC<SequenceInputProps> = ({
  className,
  prefix,
  dateFormat,
  value,
  loading
}) => {
  const date = dateFormat ? format(new Date(), dateFormat) : '';
  return (
    <div className={cn('flex gap-0.5 items-center justify-center mt-1', className)}>
      <Input
        isPending={loading}
        disabled
        className="text-muted-foreground focus-visible:ring-transparent disabled:cursor-auto w-3/12"
        value={`${prefix} -`}
      />
      <Input
        isPending={loading}
        disabled
        className="text-muted-foreground focus-visible:ring-transparent disabled:cursor-auto w-4/12"
        value={`${date} -`}
      />
      <Input
        isPending={loading}
        disabled
        type="number"
        className="text-muted-foreground focus-visible:ring-transparent disabled:cursor-auto w-5/12"
        value={value}
      />
    </div>
  );
};
