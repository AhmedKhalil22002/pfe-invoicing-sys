import { useDialog } from '@/components/common/Dialogs';
import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';

interface RoleDeleteDialogProps {
  userFullname?: string;
  activateUser?: () => void;
  isActivationPending?: boolean;
  resetUser?: () => void;
}

export const useActivateUserDialog = ({
  userFullname,
  activateUser,
  isActivationPending,
  resetUser
}: RoleDeleteDialogProps) => {
  const {
    DialogFragment: activateUserDialog,
    openDialog: openActivateUserDialog,
    closeDialog: closeActivateUserDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        Activate User <span className="font-light">{userFullname}</span> ?
      </div>
    ),
    description:
      'This action will reactivate the user and restore their associated roles and permissions. Ensure this action aligns with your intended changes',
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              activateUser?.();
              closeActivateUserDialog();
            }}>
            Activate
            <Spinner show={isActivationPending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              closeActivateUserDialog();
            }}>
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: 'w-[500px]',
    onToggle: resetUser
  });

  return {
    activateUserDialog,
    openActivateUserDialog,
    closeActivateUserDialog
  };
};
