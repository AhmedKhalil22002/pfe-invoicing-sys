import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import ActivityMain from './Activity/ActivityMain';
import TaxMain from './Tax/TaxMain';
import PaymentConditionMain from './PaymentCondition/PaymentConditionMain';
import { BreadcrumbCommon } from '../common/Breadcrumb';
import { Page404 } from '../common';
import { useRouter } from 'next/router';
import { ComingSoon } from '../common/ComingSoon';
import {
  BriefcaseBusiness,
  HashIcon,
  Magnet,
  MessageCircle,
  Receipt,
  WalletCards
} from 'lucide-react';
import { SequentialMain } from './Sequentials/SequentialMain';
import { DefaultConditionMain } from './DefaultCondition/DefaultConditionMain';
import { useBreadcrumb } from '../layout/BreadcrumbContext';
import { useTranslation } from 'react-i18next';

interface SystemSettingsProps {
  className?: string;
  defaultValue: string;
}

type TabKey = 'activity' | 'sequance' | 'payment-conditions' | 'withholding' | 'tax' | 'conditions';

export const SystemSettings: React.FC<SystemSettingsProps> = ({ className, defaultValue }) => {
  const { t: tCommon } = useTranslation('common');
  const router = useRouter();
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

  const handleTabChange = (value: string) => {
    router.push(`/settings/system/${value}`, undefined, { shallow: true });
  };
  const TABS_CONFIG: Record<
    TabKey,
    { label: string; component: React.ReactNode; icon: React.ReactNode }
  > = {
    activity: {
      label: 'settings.system.activity',
      component: <ActivityMain className="p-4 m-10" />,
      icon: <BriefcaseBusiness />
    },
    sequance: {
      label: 'settings.system.sequence',
      component: <SequentialMain className="p-10" />,
      icon: <HashIcon />
    },
    'payment-conditions': {
      label: 'settings.system.payment_condition',
      component: <PaymentConditionMain className="p-4 m-10" />,
      icon: <Receipt />
    },
    withholding: {
      label: 'settings.system.tax_withholding',
      component: <ComingSoon />,
      icon: <Magnet />
    },
    tax: {
      label: 'settings.system.tax',
      component: <TaxMain className="p-4 m-10" />,
      icon: <WalletCards />
    },
    conditions: {
      label: 'settings.system.default_condition',
      component: <DefaultConditionMain />,
      icon: <MessageCircle />
    }
  };

  if (!Object.keys(TABS_CONFIG).includes(defaultValue)) return <Page404 />;

  return (
    <div className={cn('overflow-auto p-8', className)}>
      <Tabs defaultValue={defaultValue} onValueChange={handleTabChange} className="overflow-auto">
        <TabsList className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 w-full h-fit">
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
