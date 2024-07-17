import React from 'react';
import { TableCell } from '../../ui/table';
import { Firm } from '@/api/types/firm';
import { Badge } from '../../ui/badge';
import { ExternalLinkIcon } from 'lucide-react';
import { transformDate } from '@/utils/date.utils';

interface FirmCellsProps {
  visibleColumns: { [key: string]: boolean };
  firm: Firm;
}

export const FirmCells: React.FC<FirmCellsProps> = ({ visibleColumns, firm }) => {
  return (
    <>
      <TableCell className="font-medium" hidden={!visibleColumns['[name]']}>
        {firm.name}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[mainInterlocutor][name]']}>
        {firm?.mainInterlocutor?.name} {firm?.mainInterlocutor?.surname}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[mainInterlocutor][phone]']}>
        {firm?.mainInterlocutor?.phone ? (
          firm?.mainInterlocutor?.phone
        ) : (
          <span className="text-slate-400">Aucune Téléphone</span>
        )}
      </TableCell>
      <TableCell className="font-bold" hidden={!visibleColumns['[website]']}>
        {firm?.website ? (
          <a
            className="flex items-center gap-1"
            href={firm?.website}
            target="_blank"
            rel="noreferrer">
            {firm?.website}
            <ExternalLinkIcon className="h-5 w-5" />
          </a>
        ) : (
          <span className="text-slate-400">Aucune Site Web</span>
        )}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[taxIdNumber]']}>
        {firm?.taxIdNumber}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[isPerson]']}>
        <Badge className="px-4 py-1">{firm?.isPerson ? 'Oui' : 'Non'}</Badge>
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[activity][label]']}>
        {firm?.activity?.label ? (
          firm?.activity?.label
        ) : (
          <span className="text-slate-400">Aucune Activity</span>
        )}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[currency][label]']}>
        {firm?.currency?.label ? (
          firm?.currency?.label
        ) : (
          <span className="text-slate-400">Aucun Devise</span>
        )}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[createdAt]']}>
        {transformDate(firm?.createdAt || '')}
      </TableCell>
    </>
  );
};
