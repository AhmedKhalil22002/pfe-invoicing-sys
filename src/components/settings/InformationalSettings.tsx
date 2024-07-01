import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CabinetMain from './Cabinet/CabinetMain';
import { cn } from '@/lib/utils';

interface InformationalSettingsProps {
  className?: string;
}

export const InformationalSettings: React.FC<InformationalSettingsProps> = ({ className }) => {
  return (
    <div className="overflow-auto">
      <Tabs defaultValue="cabinet" className={cn('p-10', className)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="cabinet">Cabinet</TabsTrigger>
          <TabsTrigger value="password">Banques</TabsTrigger>
        </TabsList>
        <TabsContent value="profile"></TabsContent>
        <TabsContent value="cabinet">
          <CabinetMain />
        </TabsContent>
      </Tabs>
    </div>
  );
};
