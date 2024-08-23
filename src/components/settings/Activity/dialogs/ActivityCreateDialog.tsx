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

interface ActivityCreateDialogProps {
  className?: string;
  open: boolean;
  createActivity: () => void;
  isCreatePending?: boolean;
  onClose: () => void;
}

export const ActivityCreateDialog: React.FC<ActivityCreateDialogProps> = ({
  className,
  open,
  createActivity,
  isCreatePending,
  onClose
}) => {
  const { t } = useTranslation('common');
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn('w-[25vw]', className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BriefcaseBusiness />
            <Label className="font-semibold"> Nouvelle activité</Label>
          </DialogTitle>
          <DialogDescription className="flex gap-2 py-4 items-center px-2">
            <Info className="h-10 w-10" />
            <Label className="leading-5">
              Introduisez les détails pour créer une nouvelle activité. Assurez-vous que tous les
              champs obligatoires sont remplis avant d&apos;enregistrer.
            </Label>
          </DialogDescription>
        </DialogHeader>
        <ActivityForm className="gap-2 px-3 pb-2" />
        <DialogFooter className="border-t pt-5">
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => {
                createActivity?.();
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
