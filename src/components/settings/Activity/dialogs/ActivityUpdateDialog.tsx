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
import { BriefcaseBusiness, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface ActivityUpdateDialogProps {
  className?: string;
  open: boolean;
  updateActivity: () => void;
  isUpdatePending?: boolean;
  onClose: () => void;
}

export const ActivityUpdateDialog: React.FC<ActivityUpdateDialogProps> = ({
  className,
  open,
  updateActivity,
  isUpdatePending,
  onClose
}) => {
  const { t } = useTranslation('common');
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn('w-[25vw]', className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BriefcaseBusiness />
            <Label className="font-semibold"> Mise à jour d&apos;une activité</Label>
          </DialogTitle>
          <DialogDescription className="flex gap-2 pt-2 items-center">
            <Info className="h-10 w-10" />
            <Label className="leading-5">
              Vous pouvez ici mettre à jour les détails de l&apos;activité sélectionnée.
              Assurez-vous de vérifier vos modifications avant de les enregistrer.
            </Label>
          </DialogDescription>
        </DialogHeader>
        <ActivityForm className="gap-2 px-3 pb-2" />
        <DialogFooter className="border-t pt-5">
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => {
                updateActivity?.();
              }}>
              {t('commands.save')}
              <Spinner show={isUpdatePending} />
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
