import React from 'react';
import { TableCell } from '@/components/ui/table';
import { PaymentCondition } from '@/api';

interface PaymentConditionCellsProps {
  paymentCondition: PaymentCondition;
}

export const PaymentConditionCells: React.FC<PaymentConditionCellsProps> = ({ paymentCondition }) => {
  return (
    <>
      <TableCell className="font-medium">{paymentCondition.label}</TableCell>
      <TableCell className="font-medium">
        {paymentCondition.description || <span className='text-slate-400'>Aucune Description</span>}
      </TableCell>
    </>
  );
};
