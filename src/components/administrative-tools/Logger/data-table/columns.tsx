import { Log } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { transformDateTime } from '@/utils/date.utils';
import { useLogTranslator } from '@/hooks/content/useLogTranslator';

export const getLogColumns = (tCommon: Function, tLogger: Function): ColumnDef<Log>[] => {
  const translationNamespace = 'logger';
  const translate = (value: string, namespace: string = '') => {
    return tCommon(value, { ns: namespace || translationNamespace });
  };

  return [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('common.attributes.id')}
          attribute={''}
        />
      ),
      cell: ({ row }) => <div>{row.original?.id}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'event',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('common.attributes.event')}
          attribute={''}
        />
      ),
      cell: ({ row }) => {
        const CellComponent = () => {
          const translation = useLogTranslator(row.original);
          return <div>{translation}</div>;
        };
        return <CellComponent />;
      },
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'logged_at',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('common.attributes.logged_at')}
          attribute={''}
        />
      ),
      cell: ({ row }) => (
        <div>{row.original?.loggedAt && transformDateTime(row.original?.loggedAt)}</div>
      ),
      enableSorting: true,
      enableHiding: true
    }
  ];
};
