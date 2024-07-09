import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CabinetMain from './Cabinet/CabinetMain';
import { cn } from '@/lib/utils';
import { BreadcrumbCommon } from '../common/Breadcrumb';
import { BankAccountMain } from './BankAccount/BankAccountMain';
import { Page404 } from '../common';
import { useRouter } from 'next/router';

interface InformationalSettingsProps {
  className?: string;
  defaultValue: string;
}

export const InformationalSettings: React.FC<InformationalSettingsProps> = ({
  className,
  defaultValue
}) => {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.push(`/settings/informations/${value}`, undefined, { shallow: true });
  };

  if (!['profile', 'cabinet', 'banks'].includes(defaultValue)) return <Page404 />;
  return (
    <div className={cn('overflow-auto p-8', className)}>
      <BreadcrumbCommon
        hierarchy={[{ title: 'Réglages', href: '/settings' }, { title: 'Réglages Information' }]}
      />
      <Tabs defaultValue={defaultValue} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 h-fit">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="cabinet">Cabinet</TabsTrigger>
          <TabsTrigger value="banks">Banques</TabsTrigger>
        </TabsList>
        <TabsContent value="profile"></TabsContent>
        <TabsContent value="cabinet">
          <CabinetMain />
        </TabsContent>
        <TabsContent value="banks">
          <BankAccountMain />
        </TabsContent>
      </Tabs>
    </div>
  );
};
