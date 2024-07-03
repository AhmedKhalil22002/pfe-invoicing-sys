import { Cabinet } from '@/api/types/cabinet';
import { Spinner } from '@/components/common/Spinner';
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
import useActivity from '@/hooks/useActivity';
import useCurrency from '@/hooks/useCurrency';
import { Calculator } from 'lucide-react';
import React from 'react';

interface AccountingInformationsProps {
  className?: string;
  cabinet?: Cabinet;
  isPending: boolean;
  onCabinetChange?: (updatedCabinet: Partial<Cabinet>) => void;
}

export const AccountingInformations = ({
  className,
  cabinet = {} as Cabinet,
  isPending,
  onCabinetChange
}: AccountingInformationsProps) => {
  const { activities, isFetchActivitiesPending } = useActivity();
  const { currencies, isFetchCurrenciesPending } = useCurrency();

  const handleChange = (field: string, value: number | string | { id: number }) => {
    if (onCabinetChange) {
      onCabinetChange({ ...cabinet, [field]: value });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center">
            <Calculator className="h-6 w-6 mr-2" />
            Informations Comptable
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
                value={cabinet.taxIdNumber || ''}
                onChange={(e) => handleChange('taxIdNumber', e.target.value)}
                isPending={isPending}
              />
            </div>

            <div className="mt-2 mr-2 w-full">
              <Label>Activité</Label>
              <div className="mt-2">
                <SelectShimmer isPending={isPending}>
                  <Select
                    value={cabinet?.activity?.id?.toString() || ''}
                    onValueChange={(value) => handleChange('activity', { id: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Activité" />
                    </SelectTrigger>
                    <SelectContent>
                      {isFetchActivitiesPending ? (
                        <Spinner className="m-5" />
                      ) : (
                        activities.map((activity) => (
                          <SelectItem key={activity.id} value={activity?.id?.toString() || ''}>
                            {activity.label}
                          </SelectItem>
                        ))
                      )}
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
                    value={cabinet?.currency?.id?.toString() || ''}
                    onValueChange={(value) => handleChange('currency', { id: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Devise Principale" />
                    </SelectTrigger>
                    <SelectContent>
                      {isFetchCurrenciesPending ? (
                        <Spinner className="m-5" />
                      ) : (
                        currencies.map((currency) => (
                          <SelectItem key={currency.id} value={currency?.id?.toString() || ''}>
                            {currency.label} ({currency.symbol})
                          </SelectItem>
                        ))
                      )}
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
