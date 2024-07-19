import React from 'react';
import { Activity, Currency, UpdateCabinetDto } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectShimmer,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useCabinetManager } from '@/hooks/functions/useCabinetManager';
import { Calculator } from 'lucide-react';

interface AccountingInformationProps {
  className?: string;
  activities: Activity[];
  currencies: Currency[];
  isPending?: boolean;
}

export const AccountingInformation = ({
  className,
  activities,
  currencies,
  isPending
}: AccountingInformationProps) => {
  const cabinetManager = useCabinetManager();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center">
            <Calculator className="h-6 w-6 mr-2" />
            Information Comptable
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-2 ml-2 w-full">
          <div className="flex justify-between">
            <div className="mt-2 mr-2 w-full">
              <Label>Numéro d&apos;identification Fiscale(*)</Label>
              <Input
                className="mt-2"
                placeholder="Ex. 1538414/L/A/M/0000"
                isPending={isPending}
                value={cabinetManager.taxIdNumber}
                onChange={(e) => cabinetManager.set('taxIdNumber', e.target.value)}
              />
            </div>

            <div className="mt-2 mr-2 w-full">
              <Label>Activité</Label>
              <div className="mt-2">
                <SelectShimmer isPending={isPending}>
                  <Select
                    key={cabinetManager.activity?.id?.toString() || 'activityId'}
                    value={cabinetManager.activity?.id?.toString() || undefined}
                    onValueChange={(e) => cabinetManager.set('activity', { id: +e } as Activity)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Activité" />
                    </SelectTrigger>
                    <SelectContent>
                      {activities.map((activity) => (
                        <SelectItem key={activity.id} value={activity?.id?.toString() || ''}>
                          {activity.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SelectShimmer>
              </div>
            </div>

            <div className="mt-2 mr-2 w-full">
              <Label>Devise Principale</Label>
              <div className="mt-2">
                <SelectShimmer isPending={isPending}>
                  <Select
                    key={cabinetManager.currency?.id?.toString() || 'currencyId'}
                    value={cabinetManager.currency?.id?.toString() || undefined}
                    onValueChange={(e) => cabinetManager.set('currency', { id: +e } as Currency)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Devise Principale" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.id} value={currency?.id?.toString() || ''}>
                          {currency.label} ({currency.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SelectShimmer>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
