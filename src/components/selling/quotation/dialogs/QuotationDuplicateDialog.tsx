import React from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@/components/common';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { useMediaQuery } from '@/hooks/other/useMediaQuery';
import { cn } from '@/lib/utils';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';

interface QuotationDuplicateDialogProps {
  className?: string;
  id: number;
  sequential: string;
  open: boolean;
  duplicateQuotation: (id: number) => void;
  isDuplicationPending?: boolean;
  onClose: () => void;
}

export const QuotationDuplicateDialog: React.FC<QuotationDuplicateDialogProps> = ({
  className,
  id,
  sequential,
  open,
  duplicateQuotation,
  isDuplicationPending,
  onClose
}) => {
  const { t: tCommon } = useTranslation('common');
  const isDesktop = useMediaQuery('(min-width: 1500px)');

  const header = (
    <Label className="leading-5">
      Voulez-vous vraiment dupliquer le devis N° <span className="font-semibold">{sequential}</span>{' '}
      ?
    </Label>
  );

  const footer = (
    <div className="flex gap-2 mt-2 items-center justify-center">
      <Button
        className="w-1/2 flex gap-2"
        onClick={() => {
          duplicateQuotation(id);
        }}>
        <Check />
        {tCommon('commands.duplicate')}
        <Spinner size={'small'} show={isDuplicationPending} />
      </Button>
      <Button
        className="w-1/2 flex gap-2"
        variant={'secondary'}
        onClick={() => {
          onClose();
        }}>
        <X /> {tCommon('answer.no')}
      </Button>
    </div>
  );

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={cn('max-w-[30vw] p-8', className)}>
          <DialogHeader>
            <DialogTitle />
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
          <DrawerTitle />
          <DrawerDescription className="flex gap-2 items-center px-2">{header}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="border-t pt-2">{footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
