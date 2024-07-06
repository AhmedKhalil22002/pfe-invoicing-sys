import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { Label, LabelShimmer } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectShimmer,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Activity, CreateFirmDto, Currency, PaymentCondition } from '@/api';
import { Control, Controller, UseFormRegister } from 'react-hook-form';

interface FirmProfessionalInformationsProps {
  className?: string;
  activities?: Activity[];
  currencies?: Currency[];
  paymentConditions?: PaymentCondition[];
  register: UseFormRegister<CreateFirmDto>;

  control: Control<CreateFirmDto, any>;
  watch: (name: string) => string;
  loading?: boolean;
}

const FirmProfessionalInformations = ({
  className,
  activities,
  currencies,
  paymentConditions,
  register,
  control,
  watch,
  loading
}: FirmProfessionalInformationsProps) => {
  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle className="border-b pb-2">
          <div className="flex items-center">
            <Briefcase className="h-7 w-7 mr-1" />
            <Label className="text-sm font-semibold">Informations Professionnelles</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="-mt-1 mx-1 w-2/5">
            <Label>Type(*)</Label>
            <div className="flex items-center mt-4">
              <Controller
                control={control}
                name="isPerson"
                defaultValue={watch('isPerson') === 'particulier'}
                render={({ field }) => {
                  return (
                    <RadioGroup
                      value={field.value ? 'particulier' : 'entreprise'}
                      className="block md:flex justify-center items-center"
                      onValueChange={(e) => {
                        field.onChange(e === 'particulier');
                      }}>
                      <div className="flex items-center">
                        <RadioGroupItem value="entreprise" />
                        <LabelShimmer className="ml-1" isPending={loading || false}>
                          Entreprise
                        </LabelShimmer>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="particulier" />
                        <LabelShimmer className="ml-1" isPending={loading || false}>
                          Particulier
                        </LabelShimmer>
                      </div>
                    </RadioGroup>
                  );
                }}
              />
            </div>
          </div>
          <div className="mx-1 w-3/5">
            <Label>Numéro d&apos;identification fiscale(*)</Label>
            <Input
              isPending={loading || false}
              className="mt-1"
              placeholder="Ex. 123456789"
              {...register('taxIdNumber')}
            />
          </div>
        </div>
        <div className="flex">
          <div className="mt-1 mr-2 w-1/2">
            <Label>Activité</Label>
            <div className="mt-2">
              <Controller
                control={control}
                name="activityId"
                defaultValue={+watch('activityId')}
                render={({ field }) => {
                  return (
                    <SelectShimmer isPending={loading || false}>
                      <Select
                        onValueChange={(e) => field.onChange({ target: { value: +e } })}
                        value={field.value ? field.value.toString() : ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Activité" />
                        </SelectTrigger>
                        <SelectContent>
                          {activities?.map((activity) => (
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
          <div className="mt-1 mr-2 w-1/2">
            <Label>Devise</Label>
            <div className="mt-2">
              <Controller
                control={control}
                name="currencyId"
                defaultValue={+watch('currencyId')}
                render={({ field }) => {
                  return (
                    <SelectShimmer isPending={loading || false}>
                      <Select
                        onValueChange={(e) => field.onChange({ target: { value: +e } })}
                        value={field.value ? field.value.toString() : ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Devise" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies?.map((currency) => (
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
        <div className="flex">
          <div className="mt-2 mr-2 w-full">
            <Label>Conditions de Paiement</Label>
            <div className="mt-1">
              <Controller
                control={control}
                name="paymentConditionId"
                defaultValue={+watch('paymentConditionId')}
                render={({ field }) => {
                  return (
                    <SelectShimmer isPending={loading || false}>
                      <Select
                        onValueChange={(e) => field.onChange({ target: { value: +e } })}
                        value={field.value ? field.value.toString() : ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Conditions de Paiement" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentConditions?.map((condition) => (
                            <SelectItem key={condition.id} value={condition?.id?.toString() || ''}>
                              {condition.label}
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
      </CardContent>
    </Card>
  );
};

export default FirmProfessionalInformations;
