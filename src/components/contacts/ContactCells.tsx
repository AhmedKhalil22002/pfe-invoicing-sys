import React from 'react';
import { TableCell } from '../ui/table';
import { Firm } from '@/api/types/firm';
import { Badge } from '../ui/badge';

interface ContactCellsProps {
  visibleColumns: { [key: string]: boolean };
  firm: Firm;
}

export const ContactCells: React.FC<ContactCellsProps> = ({ visibleColumns, firm }) => {
  return (
    <>
      <TableCell className="font-medium" hidden={!visibleColumns['[name]']}>
        {firm.name}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[mainInterlocutor][name]']}>
        {firm.mainInterlocutor.name} {firm.mainInterlocutor.surname}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[mainInterlocutor][phone]']}>
        {firm.mainInterlocutor.phone}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[website]']}>
        {firm.website}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[taxIdNumber]']}>
        {firm.taxIdNumber}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[isPerson]']}>
        <Badge className="px-4 py-1">{firm.isPerson ? 'Oui' : 'Non'}</Badge>
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[activity][label]']}>
        {firm.activity.label}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[currency][label]']}>
        {firm.currency.label}
      </TableCell>
    </>
  );
};
