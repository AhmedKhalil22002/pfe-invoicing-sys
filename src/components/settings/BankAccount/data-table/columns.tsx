import { BankAccount } from '@/api';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from './data-table-row-actions';
import { X } from 'lucide-react';
import { DataTableColumnHeader } from './data-table-column-header';

export const getBankAccountColumns = (t: Function): ColumnDef<BankAccount>[] => {
  const translationNamespace = 'settings';
  const translate = (value: string, namespace: string = '') => {
    return t(value, { ns: namespace || translationNamespace });
  };

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: translate('bank_account.attributes.name'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('bank_account.attributes.name')}
          attribute="name"
        />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: translate('bank_account.attributes.bic'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('bank_account.attributes.bic')}
          attribute="bic"
        />
      ),
      cell: ({ row }) => <div>{row.original.bic}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: translate('bank_account.attributes.rib'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('bank_account.attributes.rib')}
          attribute="rib"
        />
      ),
      cell: ({ row }) => <div>{row.original.rib}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: translate('bank_account.attributes.iban'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('bank_account.attributes.iban')}
          attribute="iban"
        />
      ),
      cell: ({ row }) => <div>{row.original.iban}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: translate('bank_account.attributes.currency'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('bank_account.attributes.currency')}
          attribute="currency.label"
        />
      ),
      cell: ({ row }) =>
        row.original.currency ? (
          <div>
            {row.original.currency?.label} ({row.original.currency?.symbol})
          </div>
        ) : (
          <div className="flex items-center gap-2 font-bold">
            <X className="h-5 w-5" /> <span>No Currency</span>
          </div>
        ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: translate('bank_account.attributes.isMain'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('bank_account.attributes.isMain')}
        />
      ),
      cell: ({ row }) => (
        <div>
          {
            <Badge className="px-5">
              {row.original.isMain
                ? translate('answer.yes', 'common')
                : translate('answer.no', 'common')}
            </Badge>
          }
        </div>
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions row={row} />
    }
  ];
};
