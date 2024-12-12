import { BookUser } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InterlocutorForm } from '../InterlocutorForm';
import { useSheet } from '@/components/common/Sheets';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common';

export const useInterlocutorCreateSheet = (
  firmId?: number,
  createInterlocutor?: () => void,
  isCreatePending?: boolean,
  resetInterlocutor?: () => void
) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const {
    SheetFragment: createInterlocutorSheet,
    openSheet: openInterlocutorSheet,
    closeSheet: closeInterlocutorSheet
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BookUser />
        {tContacts('interlocutor.new')}
      </div>
    ),
    description: tContacts('interlocutor.create_dialog_description'),
    children: (
      <div>
        <InterlocutorForm firmId={firmId} />
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              createInterlocutor?.();
              closeInterlocutorSheet();
            }}>
            {tCommon('commands.save')}
            <Spinner show={isCreatePending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              closeInterlocutorSheet();
            }}>
            {tCommon('commands.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'min-w-[25vw]',
    onToggle: resetInterlocutor
  });

  return { createInterlocutorSheet, openInterlocutorSheet, closeInterlocutorSheet };
};
