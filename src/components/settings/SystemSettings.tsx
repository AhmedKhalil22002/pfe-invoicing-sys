import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import ActivityMain from './Activity/ActivityMain';
import TaxMain from './Tax/TaxMain';
import PaymentConditionMain from './PaymentCondition/PaymentConditionMain';
import { BreadcrumbCommon } from '../common/Breadcrumb';
import { Page404 } from '../common';
import { useRouter } from 'next/router';

interface SystemSettingsProps {
  className?: string;
  defaultValue: string;
}

type TabKey = 'activity' | 'sequance' | 'payment-conditions' | 'withholding' | 'tax' | 'conditions';

const TABS_CONFIG: Record<TabKey, { label: string; component: React.ReactNode }> = {
  activity: {
    label: 'Activités',
    component: <ActivityMain className="mt-5" />
  },
  sequance: {
    label: 'Séquence de numérotation',
    component: null
  },
  'payment-conditions': {
    label: 'Condition de Paiement',
    component: <PaymentConditionMain className="mt-5" />
  },
  withholding: {
    label: 'Type des Retenues',
    component: null
  },
  tax: {
    label: 'Synthése des Taxe',
    component: <TaxMain className="mt-5" />
  },
  conditions: {
    label: 'Condition par défaut',
    component: null
  }
};

export const SystemSettings: React.FC<SystemSettingsProps> = ({ className, defaultValue }) => {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.push(`/settings/system/${value}`, undefined, { shallow: true });
  };

  if (!Object.keys(TABS_CONFIG).includes(defaultValue)) return <Page404 />;

  return (
    <div className={cn('overflow-auto p-8', className)}>
      <BreadcrumbCommon
        hierarchy={[
          { title: 'Réglages Systeme', href: '/settings/informations' },
          { title: TABS_CONFIG[defaultValue as TabKey].label }
        ]}
      />
      <Tabs defaultValue={defaultValue} onValueChange={handleTabChange} className="overflow-auto">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full h-fit">
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
