import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import ActivityMain from './Activity/ActivityMain';
import TaxMain from './Tax/TaxMain';
import PaymentConditionMain from './PaymentCondition/PaymentConditionMain';

interface SystemSettingsProps {
  className?: string;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({ className }) => {
  return (
    <div className="overflow-auto">
      <Tabs defaultValue="activity" className={cn('p-10', className)}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full h-fit">
          <TabsTrigger value="activity">Activités</TabsTrigger>
          <TabsTrigger value="sequance">Séquence de numérotation</TabsTrigger>
          <TabsTrigger value="payment-conditions">Condition de Paiement</TabsTrigger>
          <TabsTrigger value="withholding">Type des Retenues</TabsTrigger>
          <TabsTrigger value="tax">Synthése des Taxe</TabsTrigger>
          <TabsTrigger value="conditions">Condition par défaut</TabsTrigger>
        </TabsList>
        <TabsContent value="activity">
          <ActivityMain className="mt-5" />
        </TabsContent>
        <TabsContent value="sequance"></TabsContent>
        <TabsContent value="payment-conditions">
          <PaymentConditionMain className="mt-5"/>
        </TabsContent>
        <TabsContent value="withholding"></TabsContent>
        <TabsContent value="tax">
          <TaxMain className="mt-5" />
        </TabsContent>
        <TabsContent value="conditions"></TabsContent>
      </Tabs>
    </div>
  );
};
