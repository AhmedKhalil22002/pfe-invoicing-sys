import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common';
import { useDialog } from '@/components/common/Dialogs';

export const useInterlocutorPromoteDialog = (
  firmId?: number,
  promoteInterlocutor?: () => void,
  isPromotionPending?: boolean
) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const {
    DialogFragment: promoteInterlocutorDialog,
    openDialog: openPromoteInterlocutorDialog,
    closeDialog: closePromoteInterlocutorDialog
  } = useDialog({
    title: (
      <div className="flex items-center gap-2">
        Voulez-vous vraiment promouvoir <span className="font-semibold">{firmId}</span> ?
      </div>
    ),
    description: tContacts('interlocutor.update_dialog_description'),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              promoteInterlocutor?.();
              closePromoteInterlocutorDialog();
            }}>
            {tCommon('commands.confirm')}
            <Spinner show={isPromotionPending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              closePromoteInterlocutorDialog();
            }}>
            {tCommon('commands.cancel')}
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]'
  });

  return {
    promoteInterlocutorDialog,
    openPromoteInterlocutorDialog,
    closePromoteInterlocutorDialog
  };
};
