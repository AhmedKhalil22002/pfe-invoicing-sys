import React from 'react';
import { TableCell } from '@/components/ui/table';
import { PaymentCondition } from '@/types';

interface PaymentConditionCellsProps {
  visibleColumns: { [key: string]: boolean };
  paymentCondition: PaymentCondition;
}

export const PaymentConditionCells: React.FC<PaymentConditionCellsProps> = ({
  visibleColumns,
  paymentCondition
}) => {
  const prepareVisibility = (visibility?: boolean) => {
    return visibility === undefined ? true : visibility;
  };
  return (
    <>
      <TableCell className="font-medium" hidden={prepareVisibility(!visibleColumns['label'])}>
        {paymentCondition.label}
      </TableCell>
      <TableCell className="font-medium" hidden={prepareVisibility(!visibleColumns['description'])}>
        {paymentCondition.description || <span className="text-slate-400">Aucune Description</span>}
      </TableCell>
    </>
  );
};
