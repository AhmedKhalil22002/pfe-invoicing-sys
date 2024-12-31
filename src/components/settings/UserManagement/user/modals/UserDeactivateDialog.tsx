import { useDialog } from '@/components/common/Dialogs';
import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';

interface RoleDeleteDialogProps {
  userFullname?: string;
  deactivateUser?: () => void;
  isDeactivationPending?: boolean;
  resetUser?: () => void;
}

export const useDeactivateUserDialog = ({
  userFullname,
  deactivateUser,
  isDeactivationPending,
  resetUser
}: RoleDeleteDialogProps) => {
  const {
    DialogFragment: deactivateUserDialog,
    openDialog: openDeactivateUserDialog,
    closeDialog: closeDeactivateUserDialog
  } = useDialog({
    title: (
      <div className="leading-normal">
        Deactivate User <span className="font-light">{userFullname}</span> ?
      </div>
    ),
    description:
      'This action is irreversible and permanent. Deactivating the user will remove all associated roles and connections, affecting their access and permissions. Please proceed with caution.',
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deactivateUser?.();
              closeDeactivateUserDialog();
            }}>
            Deactivate
            <Spinner show={isDeactivationPending} />
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              closeDeactivateUserDialog();
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
    deactivateUserDialog,
    openDeactivateUserDialog,
    closeDeactivateUserDialog
  };
};
