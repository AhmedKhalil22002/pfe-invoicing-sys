import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Tax } from '@/api/types/tax';
import { Badge } from '@/components/ui/badge';

interface TaxCellsProps {
  tax: Tax;
}

export const TaxCells: React.FC<TaxCellsProps> = ({ tax }) => {
  return (
    <>
      <TableCell className="font-medium">{tax.label}</TableCell>
      <TableCell className="font-medium">{((tax.rate || 0) * 100).toFixed(2)}%</TableCell>
      <TableCell className="font-medium">
        <Badge className="px-4 py-1">{tax.isSpecial ? 'Oui' : 'Non'}</Badge>
      </TableCell>
    </>
  );
};
