import React from 'react';
import { cn } from '@/lib/utils';
import { TableBody, TableCell, TableRow } from '../ui/table';
import { Info } from 'lucide-react';

interface EmptyTableProps {
  className?: string;
  message?: string;
  colSpan?: number;
  visibleColumns?: any;
}

export const EmptyTable = ({ className, message, colSpan, visibleColumns }: EmptyTableProps) => {
  return (
    <TableBody className={cn('w-full', className)}>
      <TableRow className="hover:bg-transparent w-full">
        <TableCell
          className="w-full text-center"
          colSpan={
            colSpan ||
            Object.values(visibleColumns || {}).reduce(
              (count: number, value) => count + (value ? 1 : 0),
              0
            ) + 1
          }>
          <div className="flex items-center justify-center font-medium text-sm text-slate-600 mt-5 w-full">
            <Info className="h-7 w-7 mr-2" /> <span>{message}</span>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};
