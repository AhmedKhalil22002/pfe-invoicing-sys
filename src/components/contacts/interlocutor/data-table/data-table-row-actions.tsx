import { useRouter } from 'next/router';
import { Interlocutor } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useInterlocutorManager } from '../hooks/useInterlocutorManager';
import { useInterlocutorActions } from './ActionsContext';
import { ArrowUp, Settings2, Telescope, Trash2 } from 'lucide-react';

interface DataTableRowActionsProps {
  row: Row<Interlocutor>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const interlocutor = row.original;
  const { t: tCommon } = useTranslation('common');
  const router = useRouter();
  const interlocutorManager = useInterlocutorManager();
  const { openUpdateDialog, openDeleteDialog, openPromoteDialog, context } =
    useInterlocutorActions();
  const isMain = interlocutor.firmsToInterlocutor?.find(
    (entry) => entry.firmId == context.firmId && entry.isMain
  )?.isMain;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[160px]">
        <DropdownMenuLabel className="text-center">{tCommon('commands.actions')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/contacts/interlocutor/${interlocutor.id}`)}>
          <Telescope className="h-5 w-5 mr-2" /> {tCommon('commands.inspect')}
        </DropdownMenuItem>
        {context.firmId && (
          <DropdownMenuItem
            onClick={() => {
              interlocutorManager.setInterlocutor(interlocutor, context.firmId);
              openUpdateDialog();
            }}>
            <Settings2 className="h-5 w-5 mr-2" /> {tCommon('commands.modify')}
          </DropdownMenuItem>
        )}
        {context.firmId && !isMain && (
          <DropdownMenuItem
            onClick={() => {
              interlocutorManager.set('id', interlocutor.id);
              openPromoteDialog();
            }}>
            <ArrowUp className="h-5 w-5 mr-2" /> {tCommon('commands.promote')}
          </DropdownMenuItem>
        )}
        {!isMain && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                interlocutorManager.set('id', interlocutor.id);
                interlocutorManager.set('name', interlocutor.name);
                interlocutorManager.set('surname', interlocutor.surname);
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
