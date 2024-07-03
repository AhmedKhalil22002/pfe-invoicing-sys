import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CabinetMain from './Cabinet/CabinetMain';
import { cn } from '@/lib/utils';
import { BreadcrumbCommon } from '../common/Breadcrumb';

interface InformationalSettingsProps {
  className?: string;
}

export const InformationalSettings: React.FC<InformationalSettingsProps> = ({ className }) => {
  return (
    <div className={cn('overflow-auto p-8', className)}>
      <BreadcrumbCommon
        hierarchy={[{ title: 'Réglages', href: '/settings' }, { title: 'Réglages Information' }]}
      />
      <Tabs defaultValue="cabinet">
        <TabsList className="grid w-full grid-cols-3 h-fit">
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
