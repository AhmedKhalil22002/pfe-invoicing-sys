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
import { BriefcaseBusiness } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useMediaQuery } from '@/hooks/other/useMediaQuery';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';

interface ActivityDeleteDialogProps {
  className?: string;
  label?: string;
  open: boolean;
  deleteActivity: () => void;
  isDeletionPending?: boolean;
  onClose: () => void;
}

export const ActivityDeleteDialog: React.FC<ActivityDeleteDialogProps> = ({
  className,
  label,
  open,
  deleteActivity,
  isDeletionPending,
  onClose
}) => {
  const { t: tCommon } = useTranslation('common');
  const isDesktop = useMediaQuery('(min-width: 1500px)');
  const title = (
    <>
      <BriefcaseBusiness />
      <Label className="font-semibold"> Suppression d&apos;une activité</Label>
    </>
  );

  const description = (
    <Label className="leading-5">
      Voulez-vous vraiment supprimer <span className="font-semibold">{label}</span>
    </Label>
  );

  const footer = (
    <div className="flex gap-2 mt-2">
      <Button
        onClick={() => {
          deleteActivity?.();
        }}>
        {tCommon('answer.yes')} , {tCommon('commands.delete')}
        <Spinner show={isDeletionPending} />
      </Button>
      <Button
        variant={'secondary'}
        onClick={() => {
          onClose();
        }}>
        {tCommon('answer.no')}
      </Button>
    </div>
  );
  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className={cn('w-[25vw]', className)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
            <DialogDescription className="flex gap-2 pt-5 items-center px-2">
              {description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-t pt-2">{footer}</DialogFooter>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2">{title}</DrawerTitle>
          <DrawerDescription className="flex gap-2 pt-4 items-center px-2">
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="border-t pt-2">{footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
