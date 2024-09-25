import React from 'react';
import { Activity } from '@/types';
import { TableCell } from '@/components/ui/table';

interface ActivityCellsProps {
  visibleColumns: { [key: string]: boolean };
  activity: Activity;
}

export const ActivityCells: React.FC<ActivityCellsProps> = ({ visibleColumns, activity }) => {
  const prepareVisibility = (visibility?: boolean) => {
    return visibility === undefined ? true : visibility;
  };
  return (
    <>
      <TableCell className="font-medium" hidden={prepareVisibility(!visibleColumns['label'])}>
        {activity.label}
      </TableCell>
    </>
  );
};
