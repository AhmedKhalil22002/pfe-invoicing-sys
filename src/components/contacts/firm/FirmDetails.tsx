import React from 'react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { Page404 } from '@/components/common';
import { Spinner } from '@/components/common';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComingSoon } from '@/components/common/ComingSoon';
import { ChronologicalTimeline } from './details/ChronologicalTimeline';
import { Quotations } from './details/Quotations';
import { Info, Hourglass, File, FileText, Wallet } from 'lucide-react';
import { Overview } from './details/Overview';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useBreadcrumb } from '@/components/layout/BreadcrumbContext';

interface FirmDetailsProps {
  className?: string;
  firmId: string;
  defaultValue: string[];
}

type TabKey = 'overview' | 'chronological' | 'quotations' | 'invoices' | 'payments';

export const FirmDetails: React.FC<FirmDetailsProps> = ({ className, firmId, defaultValue }) => {
  const {
    isPending: isFetchPending,
    error,
    data: firm
  } = useQuery({
    queryKey: ['firm', firmId],
    queryFn: () => api.firm.findOne(parseInt(firmId))
  });

  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const [value1, value2] = defaultValue;

  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes([
      { title: tCommon('menu.contacts'), href: '/contacts' },
      { title: tContacts('firm.plural'), href: '/contacts/firms' },
      {
        title: `${tContacts('firm.singular')} N°${firm?.id}`,
        href: `${firm?.id}?tab=entreprise`
      },
      { title: tContacts(`firm.detailmenu.${value1}`) }
    ]);
  }, [router.locale, value1, firm?.id]);

  const TABS_CONFIG: Record<TabKey, { icon: React.ReactNode; component: React.ReactNode }> = {
    overview: {
      icon: <Info className="mr-2" />,
      component: <Overview selectedFirm={firm} defaultValue={value2} />
    },
    quotations: {
      icon: <File className="mr-2" />,
      component: <Quotations firmId={parseInt(firmId)} className="p-5 my-10" />
    },
    invoices: {
      icon: <FileText className="mr-2" />,
      component: <ComingSoon />
    },
    payments: {
      icon: <Wallet className="mr-2" />,
      component: <ComingSoon />
    },
    chronological: {
      icon: <Hourglass className="mr-2" />,
      component: <ChronologicalTimeline className="flex items-center mt-20" />
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'overview') value = 'entreprise';
    router.push(`/contacts/firm/${firmId}?tab=${value}`);
  };

  if (error) return 'An error has occurred: ' + error.message;
  else if (isFetchPending) <Spinner className="h-screen" show={isFetchPending} />;
  else if (!firm) return <Page404 />;
  else if (defaultValue)
    return (
      <div className={cn('overflow-auto p-8', className)}>
        <div>
          <Tabs defaultValue={value1 || 'overview'} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-1 lg:grid-cols-5 h-fit">
              {Object.keys(TABS_CONFIG).map((key) => (
                <TabsTrigger key={key} value={key}>
                  {TABS_CONFIG[key as TabKey].icon} {tContacts(`firm.detailmenu.${key}`)}
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
      </div>
    );
};
