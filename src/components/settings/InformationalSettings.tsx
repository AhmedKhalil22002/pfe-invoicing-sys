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

type TabKey = 'profile' | 'cabinet' | 'banks';

const TABS_CONFIG: Record<TabKey, { label: string; component: React.ReactNode }> = {
  profile: {
    label: 'Profile',
    component: null
  },
  cabinet: {
    label: 'Cabinet',
    component: <CabinetMain />
  },
  banks: {
    label: 'Banques',
    component: <BankAccountMain />
  }
};

export const InformationalSettings: React.FC<InformationalSettingsProps> = ({
  className,
  defaultValue
}) => {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.push(`/settings/informations/${value}`, undefined, { shallow: true });
  };

  if (!Object.keys(TABS_CONFIG).includes(defaultValue)) return <Page404 />;

  return (
    <div className={cn('overflow-auto p-8', className)}>
      <BreadcrumbCommon
        hierarchy={[
          { title: 'Réglages Information', href: '/settings/informations' },
          { title: TABS_CONFIG[defaultValue as TabKey].label }
        ]}
      />
      <Tabs defaultValue={defaultValue} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 h-fit">
          {Object.keys(TABS_CONFIG).map((key) => (
            <TabsTrigger key={key} value={key}>
              {TABS_CONFIG[key as TabKey].label}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.keys(TABS_CONFIG).map((key) => (
          <TabsContent key={key} value={key}>
            {TABS_CONFIG[key as TabKey].component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
