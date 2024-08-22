import React from 'react';
import { TableCell } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Interlocutor } from '@/api';
import { transformDateTime } from '@/utils/date.utils';
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
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');

  return (
    <>
      <TableCell className="font-medium" hidden={!visibleColumns['title']}>
        {interlocutor.title}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['name']}>
        {interlocutor.name}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['surname']}>
        {interlocutor.surname}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['phone']}>
        {interlocutor?.phone ? (
          interlocutor?.phone
        ) : (
          <span className="text-slate-400">{tContacts('interlocutor.empty_cells.phone')}</span>
        )}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['email']}>
        {interlocutor.email}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['createdAt']}>
        {transformDateTime(interlocutor?.createdAt || '')}
      </TableCell>
      {specificDetails && (
        <TableCell className="font-medium" hidden={!visibleColumns['isMainInOneFirm']}>
          <Badge className="px-4 py-1">
            {isMain ? tCommon('answer.yes') : tCommon('answer.no')}
          </Badge>
        </TableCell>
      )}
    </>
  );
};
