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
import { Calculator } from 'lucide-react';
import React from 'react';
import { Control, Controller, UseFormRegister } from 'react-hook-form';

interface AccountingInformationsProps {
  className?: string;
  register: UseFormRegister<UpdateCabinetDto>;
  activities: Activity[];
  currencies: Currency[];
  isPending?: boolean;

  control: Control<UpdateCabinetDto, any>;
  watch: (name: string) => string;
}

export const AccountingInformations = ({
  className,
  activities,
  currencies,
  isPending,
  register,
  control,
  watch
}: AccountingInformationsProps) => {
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
                isPending={isPending}
                {...register('taxIdNumber')}
              />
            </div>

            <div className="mt-2 mr-2 w-full">
              <Label>Activité</Label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="activityId"
                  defaultValue={+watch('activityId')}
                  render={({ field }) => {
                    return (
                      <SelectShimmer isPending={isPending}>
                        <Select
                          onValueChange={(e) => field.onChange({ target: { value: +e } })}
                          value={field.value ? field.value.toString() : ''}>
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
                    );
                  }}
                />
              </div>
            </div>

            <div className="mt-2 mr-2 w-full">
              <Label>Devise Principale</Label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="currencyId"
                  defaultValue={+watch('currencyId')}
                  render={({ field }) => {
                    return (
                      <SelectShimmer isPending={isPending}>
                        <Select
                          onValueChange={(e) => field.onChange({ target: { value: +e } })}
                          value={field.value ? field.value.toString() : ''}>
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
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
