import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { DataTableViewOptions } from './data-table-view-options';
import { cn } from '@/lib/utils';
import { useLoggerActions } from './ActionsContext';

interface DataTableToolbarProps<TData> {
  className?: string;
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ className, table }: DataTableToolbarProps<TData>) {
  const { t: tCommon } = useTranslation('common');
  const { t: tLogger } = useTranslation('logger');

  const { searchTerm, setSearchTerm } = useLoggerActions();
  return (
    <div className={cn('flex items-center justify-between gap-2', className)}>
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={tCommon('table.filter_placeholder', {
            entity: tLogger('common.plural')
          })}
          value={searchTerm?.toString()}
          onChange={(event) => {
            setSearchTerm?.(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[300px]"
        />
        {searchTerm && (
          <Button variant="ghost" onClick={() => setSearchTerm?.('')} className="h-8 px-2 lg:px-3">
            {tCommon('commands.reset')}
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between gap-5">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
