import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useMediaQuery } from '@/hooks/other/useMediaQuery';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader
} from '@/components/ui/drawer';

interface BankAccountPromoteDialogProps {
  className?: string;
  label?: string;
  open: boolean;
  promoteBankAccount: () => void;
  isPromotingPending?: boolean;
  onClose: () => void;
}

export const BankAccountPromoteDialog: React.FC<BankAccountPromoteDialogProps> = ({
  className,
  label,
  open,
  promoteBankAccount,
  isPromotingPending,
  onClose
}) => {
  const { t: tCommon } = useTranslation('common');
  const isDesktop = useMediaQuery('(min-width: 1500px)');

  const header = (
    <Label className="leading-5">
      Etes-vous sûr de vouloir promouvoir <span className="font-semibold">{label}</span> comme
      compte principal ?
    </Label>
  );

  const footer = (
    <div className="flex gap-2 mt-2 items-center justify-center">
      <Button
        className="w-1/2 flex gap-2"
        onClick={() => {
          promoteBankAccount?.();
        }}>
        <Check />
        {tCommon('commands.promote')}
        <Spinner show={isPromotingPending} />
      </Button>
      <Button
        className="w-1/2 flex gap-2"
        variant={'secondary'}
        onClick={() => {
          onClose();
        }}>
        <X />
        {tCommon('answer.no')}
      </Button>
    </div>
  );
  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={cn('max-w-[25vw] p-8', className)}>
          <DialogHeader>
            <DialogDescription className="flex gap-2 pt-4 items-center px-2">
              {header}
            </DialogDescription>
          </DialogHeader>
          {footer}
        </DialogContent>
      </Dialog>
    );
  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerDescription className="flex gap-2 pt-4 items-center px-2">
            {header}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="border-t pt-2">{footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
