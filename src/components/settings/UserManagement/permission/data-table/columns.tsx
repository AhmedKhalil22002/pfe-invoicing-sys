import { Permission } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';

export const getPermissionColumns = (t: Function): ColumnDef<Permission>[] => {
  const translationNamespace = 'settings';
  const translate = (value: string, namespace: string = '') => {
    return t(value, { ns: namespace || translationNamespace });
  };
  return [
    {
      accessorKey: 'label',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('permissions.attributes.label')}
          attribute="label"
        />
      ),
      cell: ({ row }) => <div>{row.original.label?.toUpperCase()}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('permissions.attributes.description')}
          attribute="description"
        />
      ),
      cell: ({ row }) => <div>{row.original.description || 'No Description'}</div>,
      enableSorting: true,
      enableHiding: true
    }
  ];
};
