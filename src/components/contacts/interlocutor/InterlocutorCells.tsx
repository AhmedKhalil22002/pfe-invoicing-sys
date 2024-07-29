import React from 'react';
import { TableCell } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Interlocutor } from '@/api';
import { transformDate, transformDateTime } from '@/utils/date.utils';
import { useTranslation } from 'react-i18next';

interface InterlocutorCellsProps {
  visibleColumns: { [key: string]: boolean };
  specificDetails?: boolean;
  interlocutor: Interlocutor;
  isMain?: boolean;
}

export const InterlocutorCells: React.FC<InterlocutorCellsProps> = ({
  visibleColumns,
  specificDetails,
  interlocutor,
  isMain
}) => {
  const { t } = useTranslation('common');
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
        {transformDateTime(interlocutor?.createdAt || '')}
      </TableCell>
      {specificDetails && (
        <TableCell className="font-medium" hidden={!visibleColumns['[isMainInOneFirm]']}>
          <Badge className="px-4 py-1">{isMain ? t('answer.yes') : t('answer.no')}</Badge>
        </TableCell>
      )}
    </>
  );
};
