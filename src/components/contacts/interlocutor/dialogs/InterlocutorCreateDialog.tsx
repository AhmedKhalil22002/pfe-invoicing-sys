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
import { BookUser } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/other/useMediaQuery';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InterlocutorForm } from '../InterlocutorForm';

interface InterlocutorCreateDialogProps {
  className?: string;
  open: boolean;
  createInterlocutor: () => void;
  isCreatePending?: boolean;
  onClose: () => void;
}

export const InterlocutorCreateDialog: React.FC<InterlocutorCreateDialogProps> = ({
  className,
  open,
  createInterlocutor,
  isCreatePending,
  onClose
}) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const isDesktop = useMediaQuery('(min-width: 1500px)');

  const Title = () => (
    <React.Fragment>
      <BookUser />
      {tContacts('interlocutor.new')}
    </React.Fragment>
  );

  const Description = () => (
    <React.Fragment> {tContacts('interlocutor.create_dialog_description')}</React.Fragment>
  );

  const Footer = () => (
    <div className="flex gap-2 mt-2">
      <Button
        onClick={() => {
          createInterlocutor();
        }}>
        {tCommon('commands.save')}
        <Spinner show={isCreatePending} />
      </Button>
      <Button
        variant={'secondary'}
        onClick={() => {
          onClose();
        }}>
        {tCommon('commands.cancel')}
      </Button>
    </div>
  );

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={cn('w-[40vw]', className)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Title />
            </DialogTitle>
            <DialogDescription>
              <Description />
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] w-full">
            <InterlocutorForm />
          </ScrollArea>
          <DialogFooter className="border-t pt-2">
            <Footer />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Title />
          </DrawerTitle>
          <DrawerDescription>
            <Description />
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[60vh] w-full">
          <InterlocutorForm />
        </ScrollArea>
        <DrawerFooter className="border-t pt-2">
          <Footer />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
