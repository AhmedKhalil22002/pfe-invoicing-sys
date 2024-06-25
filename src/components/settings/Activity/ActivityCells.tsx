import React from 'react';
import { Activity } from '@/api/types/activity';
import { TableCell } from '@/components/ui/table';

interface ActivityCellsProps {
  activity: Activity;
}

export const ActivityCells: React.FC<ActivityCellsProps> = ({ activity }) => {
  return (
    <>
      <TableCell className="font-medium">{activity.label}</TableCell>
    </>
  );
};
