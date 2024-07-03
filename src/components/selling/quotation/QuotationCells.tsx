import React from 'react';
import { TableCell } from '../../ui/table';
import { QUOTATION_COLUMNS_WIDTH, Quotation } from '@/api/types/quotation';
import { transformDate } from '@/utils/date.utils';
import { useRouter } from 'next/router';
import { Badge } from '@/components/ui/badge';

interface QuotationCellsProps {
  visibleColumns: { [key: string]: boolean };
  quotation?: Quotation;
}

export const QuotationCells: React.FC<QuotationCellsProps> = ({ visibleColumns, quotation }) => {
  const router = useRouter();
  return (
    <>
      <TableCell
        className="font-medium"
        hidden={!visibleColumns['[id]']}
        style={{ maxWidth: QUOTATION_COLUMNS_WIDTH['[id]'] }}>
        {quotation?.id}
      </TableCell>
      <TableCell
        className="font-medium"
        hidden={!visibleColumns['[object]']}
        style={{ maxWidth: QUOTATION_COLUMNS_WIDTH['[object]'] }}>
        {quotation?.object}
      </TableCell>
      <TableCell
        className="font-medium"
        hidden={!visibleColumns['[date]']}
        style={{ maxWidth: QUOTATION_COLUMNS_WIDTH['[date]'] }}>
        {transformDate(quotation?.date || '')}
      </TableCell>
      <TableCell
        className="font-medium"
        hidden={!visibleColumns['[dueDate]']}
        style={{ maxWidth: QUOTATION_COLUMNS_WIDTH['[dueDate]'] }}>
        {transformDate(quotation?.dueDate || '')}
      </TableCell>
      <TableCell
        className="font-medium cursor-pointer text-blue-800 hover:underline"
        hidden={!visibleColumns['[firm][name]']}
        onClick={() => router.push(`/contacts/firm/${quotation?.firmId}`)}
        style={{ maxWidth: QUOTATION_COLUMNS_WIDTH['[firm][name]'] }}>
        {quotation?.firm?.name}
      </TableCell>
      <TableCell
        className="font-medium cursor-pointer text-blue-800 hover:underline"
        hidden={!visibleColumns['[dueDate]']}
        style={{ maxWidth: QUOTATION_COLUMNS_WIDTH['[interlocutor][name]'] }}>
        {quotation?.interlocutor?.surname} {quotation?.interlocutor?.name}
      </TableCell>
      <TableCell
        className="font-medium"
        hidden={!visibleColumns['[status]']}
        style={{ width: QUOTATION_COLUMNS_WIDTH['[status]'] }}>
        <Badge className="px-4 py-1">{quotation?.status}</Badge>
      </TableCell>
      <TableCell
        className="font-medium"
        hidden={!visibleColumns['[total]']}
        style={{ maxWidth: QUOTATION_COLUMNS_WIDTH['[total]'] }}>
        {quotation?.total} {quotation?.currency?.symbol}
      </TableCell>
    </>
  );
};
