import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common';
import { useDialog } from '@/components/common/Dialogs';
import { useInterlocutorManager } from '../hooks/useInterlocutorManager';

export const useInterlocutorDisassociateDialog = (
  firmId?: number,
  disassociateInterlocutor?: (id?: number) => void,
  isDisassociatePending?: boolean
) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');

  const interlocutorManager = useInterlocutorManager();

  const {
    DialogFragment: disassociateInterlocutorDialog,
    openDialog: openDisassociateInterlocutorDialog,
    closeDialog: closeDisassociateInterlocutorDialog
  } = useDialog({
    title: (
      <div className="flex items-center gap-2">
        Voulez-vous vraiment disassociate <span className="font-semibold">{firmId}</span> ?
      </div>
    ),
    description: tContacts('interlocutor.update_dialog_description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              disassociateInterlocutor?.(interlocutorManager.id);
              closeDisassociateInterlocutorDialog();
            }}>
            {tCommon('commands.confirm')}
            <Spinner show={isDisassociatePending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              closeDisassociateInterlocutorDialog();
            }}>
            {tCommon('commands.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]'
  });

  return {
    disassociateInterlocutorDialog,
    openDisassociateInterlocutorDialog,
    closeDisassociateInterlocutorDialog
  };
};
