import React from 'react';
import { TableCell } from '../../ui/table';
import { Firm } from '@/api/types/firm';
import { Badge } from '../../ui/badge';
import { ExternalLinkIcon } from 'lucide-react';
import { Interlocutor } from '@/api';
import { transformDate } from '@/utils/date.utils';

interface InterlocutorCellsProps {
  visibleColumns: { [key: string]: boolean };
  interlocutor: Interlocutor;
}

export const InterlocutorCells: React.FC<InterlocutorCellsProps> = ({
  visibleColumns,
  interlocutor
}) => {
  return (
    <>
      <TableCell className="font-medium" hidden={!visibleColumns['[title]']}>
        {interlocutor.title}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[name]']}>
        {interlocutor.name}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[surname]']}>
        {interlocutor.surname}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[phone]']}>
        {interlocutor.phone}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[email]']}>
        {interlocutor.email}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[createdAt]']}>
        {transformDate(interlocutor?.createdAt || '')}
      </TableCell>
    </>
  );
};
