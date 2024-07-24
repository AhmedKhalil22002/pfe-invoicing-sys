import React from 'react';
import { TableCell } from '../../ui/table';
import { Firm } from '@/api/types/firm';
import { Badge } from '../../ui/badge';
import { ExternalLinkIcon } from 'lucide-react';
import { transformDateTime } from '@/utils/date.utils';
import { useTranslation } from 'react-i18next';

interface FirmCellsProps {
  visibleColumns: { [key: string]: boolean };
  firm: Firm;
}

export const FirmCells: React.FC<FirmCellsProps> = ({ visibleColumns, firm }) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
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
          <span className="text-slate-400">{tContacts('firm.empty_cells.phone')}</span>
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
          <span className="text-slate-400">{tContacts('firm.empty_cells.website')}</span>
        )}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[taxIdNumber]']}>
        {firm?.taxIdNumber}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[isPerson]']}>
        <Badge className="px-4 py-1">
          {firm?.isPerson ? tCommon('answer.yes') : tCommon('answer.no')}
        </Badge>
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[activity][label]']}>
        {firm?.activity?.label ? (
          firm?.activity?.label
        ) : (
          <span className="text-slate-400">{tContacts('firm.empty_cells.activity')}</span>
        )}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[currency][label]']}>
        {firm?.currency ? (
          <span>
            {firm?.currency?.label} ({firm?.currency?.symbol})
          </span>
        ) : (
          <span className="text-slate-400">{tContacts('firm.empty_cells.currency')}</span>
        )}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['[createdAt]']}>
        {transformDateTime(firm?.createdAt || '')}
      </TableCell>
    </>
  );
};
