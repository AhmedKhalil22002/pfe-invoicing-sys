import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Tax } from '@/api/types/tax';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface TaxCellsProps {
  visibleColumns: { [key: string]: boolean };
  tax: Tax;
}

export const TaxCells: React.FC<TaxCellsProps> = ({ visibleColumns, tax }) => {
  const prepareVisibility = (visibility?: boolean) => {
    return visibility === undefined ? true : visibility;
  };
  const { t } = useTranslation('common');
  return (
    <>
      <TableCell className="font-bold" hidden={prepareVisibility(!visibleColumns['label'])}>
        {tax.label}
      </TableCell>
      <TableCell className="font-medium" hidden={prepareVisibility(!visibleColumns['rate'])}>
        {((tax.rate || 0) * 100).toFixed(2)}%
      </TableCell>
      <TableCell className="font-medium" hidden={prepareVisibility(!visibleColumns['isSpecial'])}>
        <Badge className="px-4 py-1">{tax.isSpecial ? t('answer.yes') : t('answer.no')}</Badge>
      </TableCell>
    </>
  );
};
