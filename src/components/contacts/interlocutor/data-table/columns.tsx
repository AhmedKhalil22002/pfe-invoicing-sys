import { Interlocutor } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from './data-table-row-actions';
import { DataTableColumnHeader } from './data-table-column-header';
import { transformDateTime } from '@/utils/date.utils';
import { INTERLOCUTOR_FILTER_ATTRIBUTES } from '@/constants/interlocutor.filter-attributes';
import { Badge } from '@/components/ui/badge';

export const getInterlocutorColumns = (
  t: Function,
  tCommon: Function,
  context?: { firmId: number }
): ColumnDef<Interlocutor>[] => {
  const translationNamespace = 'contacts';
  const translate = (value: string, namespace: string = '') => {
    return t(value, { ns: namespace || translationNamespace });
  };

  const columns: ColumnDef<Interlocutor>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('interlocutor.attributes.title')}
          attribute={INTERLOCUTOR_FILTER_ATTRIBUTES.TITLE}
        />
      ),
      cell: ({ row }) => <div>{row.original.title}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('interlocutor.attributes.name')}
          attribute={INTERLOCUTOR_FILTER_ATTRIBUTES.NAME}
        />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'surname',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('interlocutor.attributes.surname')}
          attribute={INTERLOCUTOR_FILTER_ATTRIBUTES.SURNAME}
        />
      ),
      cell: ({ row }) => <div>{row.original.surname}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('interlocutor.attributes.phone')}
          attribute={INTERLOCUTOR_FILTER_ATTRIBUTES.PHONE}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original?.phone ? (
            row.original?.phone
          ) : (
            <span className="text-slate-400">{translate('interlocutor.empty_cells.phone')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('interlocutor.attributes.email')}
          attribute={INTERLOCUTOR_FILTER_ATTRIBUTES.EMAIL}
        />
      ),
      cell: ({ row }) => (
        <div className="font-bold cursor-pointer hover:underline">{row.original.email}</div>
      ),
      enableSorting: true,
      enableHiding: true
    },

    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('interlocutor.attributes.created_at')}
          attribute={INTERLOCUTOR_FILTER_ATTRIBUTES.CREATEDAT}
        />
      ),
      cell: ({ row }) => <div>{transformDateTime(row.original?.createdAt || '')}</div>,
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
  if (context && context?.firmId) {
    columns.splice(columns.length - 1, 0, {
      accessorKey: 'position',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('interlocutor.attributes.position')}
        />
      ),
      cell: ({ row }) => (
        <div>
          {
            row.original.firmsToInterlocutor?.find((firm) => firm.firmId == context.firmId)
              ?.position
          }
        </div>
      ),
      enableSorting: false,
      enableHiding: true
    });
    columns.splice(columns.length - 1, 0, {
      accessorKey: 'is_main',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translate('interlocutor.attributes.is_main')}
        />
      ),
      cell: ({ row }) => {
        return (
          <div>
            <Badge className="px-4 py-1">
              {row.original.firmsToInterlocutor?.find((firm) => firm.firmId == context.firmId)
                ?.isMain
                ? tCommon('answer.yes')
                : tCommon('answer.no')}
            </Badge>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: true
    });
  }
  return columns;
};
