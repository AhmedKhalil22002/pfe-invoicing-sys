import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import { Building, Landmark, User } from 'lucide-react';
import { useBreadcrumb } from '../layout/BreadcrumbContext';
import { useTranslation } from 'react-i18next';

type TabKey = 'profile' | 'cabinet' | 'banks';

interface InformationalSettingsProps {
  className?: string;
  defaultValue: TabKey;
}

export const InformationalSettings: React.FC<InformationalSettingsProps> = ({
  className,
  defaultValue
}) => {
  //next-router
  const router = useRouter();

  //translations
  const { t: tCommon } = useTranslation('common');

  //set page title in the breadcrumb
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

  //menu items
  const TABS_CONFIG: Record<TabKey, { label: string; icon: React.ReactNode }> = {
    profile: {
      label: 'settings.account.my_profile',
      icon: <User />
    },
    cabinet: {
      label: 'settings.account.my_cabinet',
      icon: <Building />
    },
    banks: {
      label: 'settings.account.bank_accounts',
      icon: <Landmark />
    }
  };

  const handleTabChange = (value: string) => {
    router.push(`/settings/account/${value}`);
  };

  return (
    <div className={cn(className)}>
      <Tabs defaultValue={defaultValue} onValueChange={handleTabChange} className="overflow-auto">
        <TabsList className="grid grid-cols-3 w-full h-fit">
          {Object.keys(TABS_CONFIG).map((key) => (
            <TabsTrigger key={key} value={key} className="flex gap-2 items-center">
              {TABS_CONFIG[key as TabKey].icon} {tCommon(TABS_CONFIG[key as TabKey].label)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
