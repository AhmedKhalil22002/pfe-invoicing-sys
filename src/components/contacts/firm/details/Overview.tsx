import React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Interlocutors } from './Interlocutors';
import { useRouter } from 'next/router';
import { Spinner } from '@/components/common';
import { useTranslation } from 'react-i18next';
import { FirmUpdateForm } from '../FirmUpdateForm';
import { Firm } from '@/types';

interface OverviewProps {
  className?: string;
  selectedFirm?: Firm;
  defaultValue?: string;
}

type TabKey = 'entreprise' | 'interlocutors';

export const Overview: React.FC<OverviewProps> = ({ className, selectedFirm, defaultValue }) => {
  const mainInterlocutorId = selectedFirm?.interlocutorsToFirm?.find(
    (interlocutor) => interlocutor.isMain
  )?.interlocutorId;
  const { t: tContacts } = useTranslation('contacts');
  const TABS_CONFIG: Record<TabKey, { code: string; component: React.ReactNode }> = {
    entreprise: {
      code: 'firm.singular',
      component: <FirmUpdateForm className="p-8" firmId={selectedFirm?.id || 0} />
    },
    interlocutors: {
      code: 'interlocutor.plural',
      component: (
        <Interlocutors
          className="p-8"
          firmId={selectedFirm?.id || 0}
          mainInterlocutorId={mainInterlocutorId}
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
        className={cn('p-5', className)}
        onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-1 md:grid-cols-2 h-fit w-fit border-0">
          {Object.keys(TABS_CONFIG).map((key) => (
            <TabsTrigger key={key} value={key}>
              {tContacts(TABS_CONFIG[key as TabKey].code)}
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
