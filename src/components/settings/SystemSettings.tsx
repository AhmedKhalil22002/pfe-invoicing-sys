import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import {
  BriefcaseBusiness,
  HashIcon,
  Magnet,
  MessageCircle,
  Receipt,
  WalletCards
} from 'lucide-react';
import { useBreadcrumb } from '../layout/BreadcrumbContext';
import { useTranslation } from 'react-i18next';

type TabKey = 'activity' | 'sequence' | 'payment-conditions' | 'withholding' | 'tax' | 'conditions';

interface SystemSettingsProps {
  className?: string;
  defaultValue: TabKey;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({ className, defaultValue }) => {
  //next-router
  const router = useRouter();

  //translations
  const { t: tCommon } = useTranslation('common');

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes([
      { title: tCommon('settings.system.singular') },
      {
        title: tCommon(TABS_CONFIG[defaultValue as TabKey].label),
        href: `/settings/system/${defaultValue}`
      }
    ]);
  }, [router.locale, defaultValue, tCommon]);

  //menu items
  const TABS_CONFIG: Record<TabKey, { label: string; icon: React.ReactNode }> = {
    activity: {
      label: 'settings.system.activity',
      icon: <BriefcaseBusiness />
    },
    sequence: {
      label: 'settings.system.sequence',
      icon: <HashIcon />
    },
    'payment-conditions': {
      label: 'settings.system.payment_condition',
      icon: <Receipt />
    },
    withholding: {
      label: 'settings.system.tax_withholding',
      icon: <Magnet />
    },
    tax: {
      label: 'settings.system.tax',
      icon: <WalletCards />
    },
    conditions: {
      label: 'settings.system.default_condition',
      icon: <MessageCircle />
    }
  };

  const handleTabChange = (value: string) => {
    router.push(`/settings/system/${value}`, undefined, { shallow: true });
  };

  return (
    <div className={cn(className)}>
      <Tabs defaultValue={defaultValue} onValueChange={handleTabChange} className="overflow-auto">
        <TabsList className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 w-full h-fit">
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
