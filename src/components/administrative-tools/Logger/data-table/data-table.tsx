import React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';

import { DataTableToolbar } from './data-table-toolbar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { PackageOpen, ArrowUpCircle, ArrowUp } from 'lucide-react';
import { Spinner } from '@/components/common';
import { useDebounce } from '@/hooks/other/useDebounce';
import { IconWithBadge } from '@/components/ui/icon-with-badge';

interface DataTableProps<TData, TValue> {
  className?: string;
  containerClassName?: string;
  columns: ColumnDef<TData, TValue>[];
  httpLogs: TData[];
  socketLogs: TData[];
  isPending: boolean;
  hasNextPage: boolean;
  loadMoreLogs: () => void;
}

export function DataTable<TData, TValue>({
  className,
  containerClassName,
  columns,
  httpLogs,
  socketLogs,
  isPending,
  hasNextPage,
  loadMoreLogs
}: DataTableProps<TData, TValue>) {
  const { t: tCommon } = useTranslation('common');
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const { value: debouncedPending, loading: pending } = useDebounce<boolean>(isPending, 1000);

  // Track new logs for scroll indicator
  const [newLogsCount, setNewLogsCount] = React.useState(0);
  const [seenLogsCount, setSeenLogsCount] = React.useState(0);
  const [showScrollButton, setShowScrollButton] = React.useState(false);

  // Combine logs
  const combinedLogs = React.useMemo(() => {
    return [...socketLogs, ...httpLogs];
  }, [socketLogs, httpLogs]);

  // Update new logs count when socket logs change
  React.useEffect(() => {
    if (socketLogs.length > 0) {
      setNewLogsCount(socketLogs.length);
      setShowScrollButton(true);
    }
  }, [socketLogs]);

  // Handle scrolling to top
  const handleScrollToTop = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setShowScrollButton(false);
    setSeenLogsCount(seenLogsCount + newLogsCount);
    setNewLogsCount(0);
  };

  const table = useReactTable({
    data: combinedLogs,
    columns,
    state: {
      sorting,
      rowSelection,
      columnFilters
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  });

  React.useEffect(() => {
    table.setPageSize(combinedLogs.length);
  }, [combinedLogs]);

  React.useEffect(() => {
    const tableContainer = tableContainerRef.current;
    if (!tableContainer) return;

    const handleScroll = (event: Event) => {
      const { scrollTop, scrollHeight, clientHeight } = tableContainer;
      if (scrollTop + clientHeight >= scrollHeight - 10 && hasNextPage && !debouncedPending) {
        loadMoreLogs();
      }
      if (scrollTop < 50) {
        setShowScrollButton(false);
        setNewLogsCount(0);
      }
    };

    tableContainer.addEventListener('scroll', handleScroll);
    return () => tableContainer.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, debouncedPending, loadMoreLogs]);

  return (
    <div className={cn(className, 'space-y-6')}>
      <DataTableToolbar table={table} />
      <div
        ref={tableContainerRef}
        className={cn('rounded-md border overflow-auto', containerClassName)}>
        <Table className="table-fixed relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getContext().column.getSize() }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            <div
              className={cn(
                'flex items-center justify-center gap-2 font-bold',
                'sticky h-0 w-0 left-1/2 top-24 z-10',
                'transition-all duration-300 ease-in-out',
                showScrollButton ? 'opacity-100' : 'opacity-0'
              )}>
              <IconWithBadge
                icon={ArrowUpCircle}
                iconClassName="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full"
                text={newLogsCount - seenLogsCount}
                position="top-right"
                onClick={handleScrollToTop}
              />
            </div>
            {table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}

            {!(hasNextPage || pending) ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-12 text-center">
                  <div className="flex items-center justify-center gap-2 font-bold">
                    {tCommon('table.no_results')} <PackageOpen />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-12 text-center">
                  <div className="flex items-center justify-center gap-2 font-bold">
                    {tCommon('table.loading')} <Spinner />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
