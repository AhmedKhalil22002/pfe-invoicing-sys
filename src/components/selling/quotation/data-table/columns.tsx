import { Quotation } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from './data-table-row-actions';
import { DataTableColumnHeader } from './data-table-column-header';
import { transformDate, transformDateTime } from '@/utils/date.utils';
import { NextRouter } from 'next/router';
import { QUOTATION_FILTER_ATTRIBUTES } from '@/constants/quotationt.filter-attributes';

export const getQuotationColumns = (t: Function, router: NextRouter): ColumnDef<Quotation>[] => {
  const translationNamespace = 'invoicing';
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
      accessorKey: translate('quotation.attributes.number'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('quotation.attributes.number')}
          attribute={QUOTATION_FILTER_ATTRIBUTES.SEQUENTIAL}
        />
      ),
      cell: ({ row }) => <div>{row.original.sequential}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: translate('quotation.attributes.date'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('quotation.attributes.date')}
          attribute={QUOTATION_FILTER_ATTRIBUTES.DATE}
        />
      ),
      cell: ({ row }) => <div>{row.original.date && transformDate(row.original.date)}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: translate('quotation.attributes.due_date'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('quotation.attributes.due_date')}
          attribute={QUOTATION_FILTER_ATTRIBUTES.DUEDATE}
        />
      ),
      cell: ({ row }) => <div>{row.original.dueDate && transformDate(row.original.dueDate)}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: translate('quotation.attributes.firm'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('quotation.attributes.firm')}
          attribute={QUOTATION_FILTER_ATTRIBUTES.FIRM}
        />
      ),
      cell: ({ row }) => (
        <div
          className="font-bold cursor-pointer hover:underline"
          onClick={() => router.push(`/contacts/firm/${row.original?.firmId}`)}>
          {row.original.firm?.name}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: translate('quotation.attributes.interlocutor'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('quotation.attributes.interlocutor')}
          attribute={QUOTATION_FILTER_ATTRIBUTES.INTERLOCUTOR}
        />
      ),
      cell: ({ row }) => (
        <div
          className="font-bold cursor-pointer hover:underline"
          onClick={() => router.push(`/contacts/interlocutor/${row.original?.interlocutorId}`)}>
          {row.original?.interlocutor?.surname} {row.original?.interlocutor?.name}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: translate('quotation.attributes.status'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('quotation.attributes.status')}
          attribute={QUOTATION_FILTER_ATTRIBUTES.STATUS}
        />
      ),
      cell: ({ row }) => (
        <div>
          <Badge className="px-4 py-1">{t(row.original?.status || '')}</Badge>
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: translate('quotation.attributes.total'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('quotation.attributes.total')}
          attribute={QUOTATION_FILTER_ATTRIBUTES.TOTAL}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original?.total?.toFixed(row.original?.currency?.digitAfterComma)}{' '}
          {row.original?.currency?.symbol}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: translate('quotation.attributes.created_at'),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('quotation.attributes.created_at')}
          attribute={QUOTATION_FILTER_ATTRIBUTES.CREATEDAT}
        />
      ),
      cell: ({ row }) => <div>{transformDateTime(row.original?.createdAt || '')}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions row={row} />
    }
  ];
};
