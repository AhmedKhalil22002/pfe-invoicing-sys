import { BankAccount } from '@/api';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useBankAccountManager } from '../hooks/useBankAccountManager';
import { useActionDialogs } from './ActionDialogContext';
import { ArrowUp, Settings2, Trash2 } from 'lucide-react';

interface DataTableRowActionsProps {
  row: Row<BankAccount>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const account = row.original;
  const { t: tCommon } = useTranslation('common');
  const bankAccountManager = useBankAccountManager();
  const { openUpdateDialog, openDeleteDialog, openPromoteDialog } = useActionDialogs();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[160px]">
        <DropdownMenuLabel className="text-center">Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            bankAccountManager.setBankAccount(account);
            openUpdateDialog();
          }}>
          <Settings2 className="h-5 w-5 mr-2" /> {tCommon('commands.modify')}
        </DropdownMenuItem>
        {!account.isMain && (
          <DropdownMenuItem
            onClick={() => {
              bankAccountManager.setBankAccount(account);
              openPromoteDialog();
            }}>
            <ArrowUp className="h-5 w-5 mr-2" /> Principal
          </DropdownMenuItem>
        )}
        {!account.isMain && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                bankAccountManager.setBankAccount(account);
                openDeleteDialog();
              }}>
              <Trash2 className="h-5 w-5 mr-2" /> {tCommon('commands.delete')}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
