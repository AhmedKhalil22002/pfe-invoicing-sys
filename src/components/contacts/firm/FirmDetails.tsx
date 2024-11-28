import React from 'react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { Page404 } from '@/components/common';
import { Spinner } from '@/components/common';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Hourglass, File, FileText, Wallet, Users } from 'lucide-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useBreadcrumb } from '@/components/layout/BreadcrumbContext';

type TabKey =
  | 'overview'
  | 'interlocutors'
  | 'chronological'
  | 'quotations'
  | 'invoices'
  | 'payments';

interface FirmDetailsProps {
  className?: string;
  firmId: string;
  defaultValue: TabKey;
}

export const FirmDetails: React.FC<FirmDetailsProps> = ({ className, firmId, defaultValue }) => {
  //next-router
  const router = useRouter();

  const {
    isPending: isFetchPending,
    error,
    data: firm
  } = useQuery({
    queryKey: ['firm', firmId],
    queryFn: () => api.firm.findOne(parseInt(firmId))
  });

  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');

  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    if (firm?.id)
      setRoutes([
        { title: tCommon('menu.contacts'), href: '/contacts' },
        { title: tContacts('firm.plural'), href: '/contacts/firms' },
        {
          title: `${tContacts('firm.singular')} N°${firm?.id}`,
          href: `/contacts/firm/${firm?.id}/overview`
        }
      ]);
  }, [router.locale, firm?.id]);

  const TABS_CONFIG: Record<TabKey, { label: string; icon: React.ReactNode }> = {
    overview: {
      label: 'firm.detailmenu.overview',
      icon: <Info />
    },
    interlocutors: {
      label: 'firm.detailmenu.interlocutors',
      icon: <Users />
    },
    quotations: {
      label: 'firm.detailmenu.quotations',
      icon: <File />
    },
    invoices: {
      label: 'firm.detailmenu.invoices',
      icon: <FileText />
    },
    payments: {
      label: 'firm.detailmenu.payments',
      icon: <Wallet />
    },
    chronological: {
      label: 'firm.detailmenu.chronological',
      icon: <Hourglass />
    }
  };

  const handleTabChange = (value: string) => {
    router.push(`/contacts/firm/${firmId}/${value}`);
  };

  if (error) return 'An error has occurred: ' + error.message;
  else if (isFetchPending) <Spinner className="h-screen" show={isFetchPending} />;
  else if (!firm) return <Page404 />;
  else if (defaultValue)
    return (
      <div className={cn(className)}>
        <Tabs defaultValue={defaultValue} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-6 h-fit">
            {Object.keys(TABS_CONFIG).map((key) => (
              <TabsTrigger key={key} value={key} className="flex gap-2 items-center">
                {TABS_CONFIG[key as TabKey].icon} {tContacts(`firm.detailmenu.${key}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    );
};
