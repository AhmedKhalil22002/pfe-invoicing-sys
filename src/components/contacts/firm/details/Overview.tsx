import React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Interlocutors } from './Interlocutors';
import { Firm } from '@/api';
import { FirmUpdateForm } from '../FirmUpdateForm';
import { useRouter } from 'next/router';
import { Page404, Spinner } from '@/components/common';

interface OverviewProps {
  className?: string;
  selectedFirm?: Firm;
  defaultValue?: string;
}

type TabKey = 'entreprise' | 'interlocutors';

export const Overview: React.FC<OverviewProps> = ({ className, selectedFirm, defaultValue }) => {
  const TABS_CONFIG: Record<TabKey, { label: string; component: React.ReactNode }> = {
    entreprise: {
      label: 'Entreprise',
      component: <FirmUpdateForm firmId={selectedFirm?.id || 0} isNested={true} />
    },
    interlocutors: {
      label: 'Interlocuteurs',
      component: (
        <Interlocutors
          firmId={+(selectedFirm?.id || 0)}
          mainInterlocutorId={selectedFirm?.mainInterlocutorId}
        />
      )
    }
  };
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(!selectedFirm);
  }, [defaultValue, selectedFirm]);

  const router = useRouter();
  const handleTabChange = (value: string) => {
    router.push(`/contacts/firm/${selectedFirm?.id}?tab=${value}`);
  };

  if (loading) return <Spinner className="h-screen" show={true} />;
  if (defaultValue === 'entreprise' || defaultValue === 'interlocutors')
    return (
      <Tabs
        defaultValue={defaultValue || 'entreprise'}
        className={cn('py-2', className)}
        onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-1 md:grid-cols-2 h-fit w-fit border-0">
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
    );
};
