import React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComingSoon } from '@/components/common/ComingSoon';
import { Interlocutors } from './Interlocutors';
import { Firm } from '@/api';
import { FirmUpdateForm } from '../FirmUpdateForm';

interface EditFirmProps {
  className?: string;
  selectedFirm: Firm;
}

export const EditFirm: React.FC<EditFirmProps> = ({ className, selectedFirm }) => {
  return (
    <Tabs defaultValue="entreprise" className={cn('py-2', className)}>
      <TabsList className="grid grid-cols-1 md:grid-cols-2 h-fit w-fit">
        <TabsTrigger value="entreprise">Entreprise</TabsTrigger>
        <TabsTrigger value="interlocutors">Interlocuteurs</TabsTrigger>
      </TabsList>
      <TabsContent value="entreprise">
        <FirmUpdateForm firmId={selectedFirm?.id || 0} isNested={true} />
      </TabsContent>
      <TabsContent value="interlocutors">
        <Interlocutors
          firmId={+(selectedFirm?.id || 0)}
          mainInterlocutorId={selectedFirm?.mainInterlocutorId}
        />
      </TabsContent>
    </Tabs>
  );
};
