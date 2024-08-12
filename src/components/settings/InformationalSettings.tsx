import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CabinetMain from './Cabinet/CabinetMain';
import { cn } from '@/lib/utils';
import { BreadcrumbCommon } from '../common/Breadcrumb';
import { BankAccountMain } from './BankAccount/BankAccountMain';
import { Page404 } from '../common';
import { useRouter } from 'next/router';
import { ComingSoon } from '../common/ComingSoon';
import { Building, Landmark, User } from 'lucide-react';

interface InformationalSettingsProps {
  className?: string;
  defaultValue: string;
}

type TabKey = 'profile' | 'cabinet' | 'banks';

export const InformationalSettings: React.FC<InformationalSettingsProps> = ({
  className,
  defaultValue
}) => {
  const TABS_CONFIG: Record<
    TabKey,
    { label: string; component: React.ReactNode; icon: React.ReactNode }
  > = {
    profile: {
      label: 'Profile',
      component: <ComingSoon />,
      icon: <User className="h-5 w-5" />
    },
    cabinet: {
      label: 'Cabinet',
      component: <CabinetMain />,
      icon: <Building className="h-5 w-5" />
    },
    banks: {
      label: 'Banques',
      component: <BankAccountMain />,
      icon: <Landmark className="h-5 w-5" />
    }
  };
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.push(`/settings/Information/${value}`, undefined, { shallow: true });
  };

  if (!Object.keys(TABS_CONFIG).includes(defaultValue)) return <Page404 />;

  return (
    <div className={cn('overflow-auto p-8', className)}>
      <BreadcrumbCommon
        hierarchy={[
          { title: 'Réglages Information', href: '/settings/Information' },
          { title: TABS_CONFIG[defaultValue as TabKey].label }
        ]}
      />
      <Tabs defaultValue={defaultValue} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 h-fit">
          {Object.keys(TABS_CONFIG).map((key) => (
            <TabsTrigger key={key} value={key} className="flex gap-2 items-center">
              {TABS_CONFIG[key as TabKey].icon} {TABS_CONFIG[key as TabKey].label}
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
