import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { DataTableViewOptions } from './data-table-view-options';
import { cn } from '@/lib/utils';
import { useLoggerActions } from './ActionsContext';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { EVENT_TYPE } from '@/types/enums/event-types';

interface DataTableToolbarProps<TData> {
  className?: string;
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ className, table }: DataTableToolbarProps<TData>) {
  const { t: tCommon } = useTranslation('common');
  const { t: tLogger } = useTranslation('logger');

  const { startDate, endDate, setStartDate, setEndDate } = useLoggerActions();
  return (
    <div className={cn('flex items-center justify-between gap-2', className)}>
      <div className="flex flex-1 items-center justify-start space-x-2">
        <div className="flex flex-row gap-4">
          <div className="flex flex-row gap-2 items-center">
            <Label className="text-sm">Start Date</Label>
            <DatePicker value={startDate} onChange={(date: Date) => setStartDate?.(date)} />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Label className="text-sm">End Date</Label>
            <DatePicker value={endDate} onChange={(date: Date) => setEndDate?.(date)} />
          </div>
        </div>

        {(startDate || endDate) && (
          <Button
            variant="ghost"
            onClick={() => {
              setStartDate?.(undefined);
              setEndDate?.(undefined);
            }}
            className="h-8 px-2 lg:px-3 w-fit">
            {tCommon('commands.reset')}
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between gap-5">
        {table.getColumn('event') && <div className="flex flex-row gap-2 items-center"></div>}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
