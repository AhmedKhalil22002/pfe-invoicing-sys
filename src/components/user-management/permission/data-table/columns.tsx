import { Permission } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';

export const getPermissionColumns = (): ColumnDef<Permission>[] => {
  return [
    {
      accessorKey: 'label',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Label" attribute="label" />
      ),
      cell: ({ row }) => <div>{row.original.label?.toUpperCase()}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" attribute="description" />
      ),
      cell: ({ row }) => <div>{row.original.description || 'No Description'}</div>,
      enableSorting: true,
      enableHiding: true
    }
  ];
};
