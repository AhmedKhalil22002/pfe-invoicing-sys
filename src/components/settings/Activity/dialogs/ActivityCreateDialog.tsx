import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common';
import { ActivityForm } from '../ActivityForm';
import { Info } from 'lucide-react';

interface ActivityCreateDialogProps {
  className?: string;
  id?: number;
  open: boolean;
  CreateActivity: () => void;
  isCreatePending?: boolean;
  onClose: () => void;
}

export const ActivityCreateDialog: React.FC<ActivityCreateDialogProps> = ({
  className,
  id,
  open,
  CreateActivity,
  isCreatePending,
  onClose
}) => {
  const { t } = useTranslation('common');
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={className}>
        <DialogHeader className="-mb-3">
          <DialogTitle className="flex items-center gap-2">Ajout d&apos;une activité</DialogTitle>
          <DialogDescription className="flex gap-2 pt-2 items-center">
            <Info className="h-10 w-10" /> Introduisez les détails pour créer une nouvelle activité.
            Assurez-vous que tous les champs obligatoires sont remplis avant d&apos;enregistrer.
          </DialogDescription>
        </DialogHeader>
        <ActivityForm className="px-2" />
        <DialogFooter>
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => {
                CreateActivity?.();
              }}>
              {t('commands.save')}
              <Spinner show={isCreatePending} />
            </Button>
            <Button
              variant={'secondary'}
              onClick={() => {
                onClose();
              }}>
              {t('commands.cancel')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
