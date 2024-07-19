import React from 'react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { BreadcrumbCommon } from '@/components/common';
import { Spinner } from '@/components/common';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComingSoon } from '@/components/common/ComingSoon';
import { ChronologicalTimeline } from './details/ChronologicalTimeline';
import { Quotations } from './details/Quotations';
import { Info, Hourglass, File, FileText, Wallet } from 'lucide-react';
import { Overview } from './details/Overview';

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
        <Tabs defaultValue="overview" className={cn(className)}>
          <TabsList className="grid grid-cols-1 md:grid-cols-5 w-full h-fit">
            <TabsTrigger value="overview">
              <Info className="mr-2" /> Aperçu Général
            </TabsTrigger>
            <TabsTrigger value="chronological">
              <Hourglass className="mr-2" /> Chronologie
            </TabsTrigger>
            <TabsTrigger value="quotations">
              <File className="mr-2" /> Devis
            </TabsTrigger>
            <TabsTrigger value="invoices">
              <FileText className="mr-2" />
              Factures
            </TabsTrigger>
            <TabsTrigger value="payments">
              <Wallet className="mr-2" />
              Paiements
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Overview selectedFirm={firm} />
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
