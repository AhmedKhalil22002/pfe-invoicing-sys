import React from 'react';
import { InterlocutorContactInformation } from './form/InterlocutorContactInformation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { InterlocutorAssociation } from './form/InterlocutorAssociation';

interface InterlocutorFormProps {
  className?: string;
  firmId?: number;
}

export const InterlocutorForm: React.FC<InterlocutorFormProps> = ({ className, firmId }) => {
  return (
    <div className={cn('my-4', className)}>
      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new">Make a new Interlocutor</TabsTrigger>
          <TabsTrigger value="existing">Existing Interlocutor</TabsTrigger>
        </TabsList>
        <TabsContent value="new">
          <InterlocutorContactInformation className="my-4" />
        </TabsContent>
        <TabsContent value="existing">
          <InterlocutorAssociation className="my-4" />
        </TabsContent>
      </Tabs>
    </div>
  );
};
