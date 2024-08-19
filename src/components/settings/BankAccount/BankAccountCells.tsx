import React from 'react';
import { TableCell } from '@/components/ui/table';
import { BankAccount } from '@/api';
import { transformDate } from '@/utils/date.utils';
import { Badge } from '@/components/ui/badge';

interface BankAccountProps {
  bankAccount: BankAccount;
  visibleColumns: { [key: string]: boolean };
}

export const BankAccountCells: React.FC<BankAccountProps> = ({ bankAccount, visibleColumns }) => {
  return (
    <>
      <TableCell className="font-medium" hidden={!visibleColumns['name']}>
        {bankAccount.name}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['bic']}>
        {bankAccount.bic}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['rib']}>
        {bankAccount.rib}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['iban']}>
        {bankAccount.iban}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['currency.label']}>
        {bankAccount?.currency?.label} {bankAccount?.currency?.symbol}
      </TableCell>
      <TableCell className="font-medium" hidden={!visibleColumns['isMain']}>
        <Badge className="px-4 py-1">{bankAccount?.isMain ? 'Oui' : 'Non'}</Badge>
      </TableCell>
    </>
  );
};
