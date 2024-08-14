import React from 'react';
import { TableCell } from '../../ui/table';
import { Quotation } from '@/api/types/quotation';
import { transformDate, transformDateTime } from '@/utils/date.utils';
import { useRouter } from 'next/router';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface QuotationCellsProps {
  visibleColumns: { [key: string]: boolean };
  quotation?: Quotation;
}

export const QuotationCells: React.FC<QuotationCellsProps> = ({ visibleColumns, quotation }) => {
  const router = useRouter();
  const { t } = useTranslation('invoicing');
  const prepareVisibility = (visibility?: boolean) => {
    return visibility === undefined ? true : visibility;
  };
  return (
    <>
      <TableCell className="font-medium" hidden={prepareVisibility(!visibleColumns['sequential'])}>
        {quotation?.sequential}
      </TableCell>
      <TableCell className="font-medium" hidden={prepareVisibility(!visibleColumns['date'])}>
        {transformDate(quotation?.date || '')}
      </TableCell>
      <TableCell className="font-medium" hidden={prepareVisibility(!visibleColumns['dueDate'])}>
        {transformDate(quotation?.dueDate || '')}
      </TableCell>
      <TableCell
        className="font-bold cursor-pointer hover:underline"
        hidden={prepareVisibility(!visibleColumns['firm.name'])}
        onClick={() => router.push(`/contacts/firm?id=${quotation?.firmId}`)}>
        <div className="flex items-center gap-1">
          <span>{quotation?.firm?.name}</span>
        </div>
      </TableCell>
      <TableCell
        className="font-bold cursor-pointer hover:underline"
        hidden={prepareVisibility(!visibleColumns['interlocutor.name'])}
        onClick={() => router.push(`/contacts/interlocutor?id=${quotation?.interlocutorId}`)}>
        <div className="flex items-center gap-1">
          <span>
            {quotation?.interlocutor?.surname} {quotation?.interlocutor?.name}
          </span>
        </div>
      </TableCell>
      <TableCell className="font-medium" hidden={prepareVisibility(!visibleColumns['status'])}>
        <Badge className="px-4 py-1">{t(quotation?.status || '')}</Badge>
      </TableCell>
      <TableCell className="font-medium" hidden={prepareVisibility(!visibleColumns['total'])}>
        {quotation?.total?.toFixed(3)} {quotation?.currency?.symbol}
      </TableCell>
      <TableCell className="font-medium" hidden={prepareVisibility(!visibleColumns['createdAt'])}>
        {transformDateTime(quotation?.createdAt || '')}
      </TableCell>
    </>
  );
};
