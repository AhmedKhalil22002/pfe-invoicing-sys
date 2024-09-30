import { Tax } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from './data-table-row-actions';
import { TAX_FILTER_ATTRIBUTES } from '@/constants/tax.filter-attributes';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';

export const getTaxColumns = (t: Function, tCommon: Function): ColumnDef<Tax>[] => {
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
          title={translate('tax.attributes.label')}
          attribute={TAX_FILTER_ATTRIBUTES.LABEL}
        />
      ),
      cell: ({ row }) => <div>{row.original.label}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'rate',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('tax.attributes.rate')}
          attribute={TAX_FILTER_ATTRIBUTES.RATE}
        />
      ),
      cell: ({ row }) => <div>{((row.original.rate || 0) * 100).toFixed(2)}%</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'is_special',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('tax.attributes.is_special')}
          attribute={TAX_FILTER_ATTRIBUTES.RATE}
        />
      ),
      cell: ({ row }) => (
        <div>
          <Badge className="px-4 py-1">
            {row.original.isSpecial ? tCommon('answer.yes') : tCommon('answer.no')}
          </Badge>
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DataTableRowActions row={row} />
        </div>
      )
    }
  ];
};
