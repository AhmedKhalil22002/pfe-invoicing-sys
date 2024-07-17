import React from 'react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { BreadcrumbCommon } from '@/components/common';
import { Spinner } from '@/components/common';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComingSoon } from '@/components/common/ComingSoon';
import { ChronologicalTimeline } from './details/ChronologicalTimeline';
import { Overview } from './details/Overview';
import { Quotations } from './details/Quotations';

interface FirmDetailsProps {
  className?: string;
  firmId: string;
}

export const FirmDetails: React.FC<FirmDetailsProps> = ({ className, firmId }) => {
  const {
    isPending: isFetchPending,
    error,
    data: firm
    // refetch: refetchFirm
  } = useQuery({
    queryKey: ['firm', firmId],
    queryFn: () => api.firm.findOne(+firmId)
  });

  if (error) return 'An error has occurred: ' + error.message;
  if (isFetchPending || !firm) return <Spinner className="h-screen" show={isFetchPending} />;
  return (
    <div className={cn('overflow-auto p-8', className)}>
      <BreadcrumbCommon
        hierarchy={[
          { title: 'Contacts', href: '/contacts' },
          { title: 'Entreprise', href: '/contacts/firms' },
          { title: firm?.name || '' }
        ]}
      />
      <div>
        <Tabs defaultValue="overview" className={cn('', className)}>
          <TabsList className="grid grid-cols-1 md:grid-cols-5 w-full h-fit">
            <TabsTrigger value="overview">Aperçu Général</TabsTrigger>
            <TabsTrigger value="chronological">Chronologie</TabsTrigger>
            <TabsTrigger value="quotations">Devis</TabsTrigger>
            <TabsTrigger value="invoices">Factures</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Overview firmId={+firmId} />
          </TabsContent>
          <TabsContent value="chronological">
            <div className="w-fit mx-auto">
              <ChronologicalTimeline className="p-10" />
            </div>
          </TabsContent>
          <TabsContent value="quotations">
            <Quotations firmId={+firmId} />
          </TabsContent>
          <TabsContent value="invoices">
            <ComingSoon />
          </TabsContent>
          <TabsContent value="payments">
            <ComingSoon />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
