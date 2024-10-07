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
import { useBreadcrumb } from '../layout/BreadcrumbContext';

interface InformationalSettingsProps {
  className?: string;
  defaultValue: string;
}

type TabKey = 'profile' | 'cabinet' | 'banks';

const TABS_CONFIG: Record<
  TabKey,
  { label: string; component: React.ReactNode; icon: React.ReactNode }
> = {
  profile: {
    label: 'Mon Profile',
    component: <ComingSoon />,
    icon: <User />
  },
  cabinet: {
    label: 'Mon Cabinet',
    component: <CabinetMain className="p-10" />,
    icon: <Building />
  },
  banks: {
    label: 'Comptes Bancaires',
    component: <BankAccountMain className="p-4 m-10" />,
    icon: <Landmark />
  }
};
export const InformationalSettings: React.FC<InformationalSettingsProps> = ({
  className,
  defaultValue
}) => {
  const router = useRouter();
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes([
      { title: 'Réglages Information', href: '/settings/information' },
      { title: TABS_CONFIG[defaultValue as TabKey].label }
    ]);
  }, [router.locale, defaultValue]);

  const handleTabChange = (value: string) => {
    router.push(`/settings/information/${value}`, undefined, { shallow: true });
  };

  if (!Object.keys(TABS_CONFIG).includes(defaultValue)) return <Page404 />;
  return (
    <div className={cn('overflow-auto p-8', className)}>
      <Tabs defaultValue={defaultValue} onValueChange={handleTabChange} className="overflow-auto">
        <TabsList className="grid grid-cols-3 w-full h-fit">
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
