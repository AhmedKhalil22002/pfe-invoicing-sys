import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CabinetMain from './Cabinet/CabinetMain';
import { cn } from '@/lib/utils';
import { BankAccountMain } from './BankAccount/BankAccountMain';
import { Page404 } from '../common';
import { useRouter } from 'next/router';
import { ComingSoon } from '../common/ComingSoon';
import { Building, Landmark, User } from 'lucide-react';
import { useBreadcrumb } from '../layout/BreadcrumbContext';
import { useTranslation } from 'react-i18next';

interface InformationalSettingsProps {
  className?: string;
  defaultValue: string;
}

type TabKey = 'profile' | 'cabinet' | 'banks';

export const InformationalSettings: React.FC<InformationalSettingsProps> = ({
  className,
  defaultValue
}) => {
  const { t: tCommon } = useTranslation('common');
  const router = useRouter();
  const { setRoutes } = useBreadcrumb();

  React.useEffect(() => {
    setRoutes([
      { title: tCommon('settings.account.singular') },
      {
        title: tCommon(TABS_CONFIG[defaultValue as TabKey].label),
        href: `/settings/account/${defaultValue}`
      }
    ]);
  }, [router.locale, defaultValue, tCommon]);

  const TABS_CONFIG: Record<
    TabKey,
    { label: string; component: React.ReactNode; icon: React.ReactNode }
  > = {
    profile: {
      label: 'settings.account.my_profile',
      component: <ComingSoon />,
      icon: <User />
    },
    cabinet: {
      label: 'settings.account.my_cabinet',
      component: <CabinetMain className="p-10" />,
      icon: <Building />
    },
    banks: {
      label: 'settings.account.bank_accounts',
      component: <BankAccountMain className="p-4 m-10" />,
      icon: <Landmark />
    }
  };

  const handleTabChange = (value: string) => {
    router.push(`/settings/account/${value}`, undefined, { shallow: true });
  };

  if (!Object.keys(TABS_CONFIG).includes(defaultValue)) return <Page404 />;
  return (
    <div className={cn('overflow-auto p-8', className)}>
      <Tabs defaultValue={defaultValue} onValueChange={handleTabChange} className="overflow-auto">
        <TabsList className="grid grid-cols-3 w-full h-fit">
          {Object.keys(TABS_CONFIG).map((key) => (
            <TabsTrigger key={key} value={key} className="flex gap-2 items-center">
              {TABS_CONFIG[key as TabKey].icon} {tCommon(TABS_CONFIG[key as TabKey].label)}
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
