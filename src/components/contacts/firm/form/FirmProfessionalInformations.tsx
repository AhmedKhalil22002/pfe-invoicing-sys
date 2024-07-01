import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<CreateFirmDto, any>;
}

const FirmProfessionalInformations = ({
  className,
  activities,
  currencies,
  paymentConditions,
  register,
  control
}: FirmProfessionalInformationsProps) => {
  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle className="border-b">
          <div className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            <Label className="text-sm font-semibold">Informations Professionnelles</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="-mt-1 mx-1 w-2/5">
            <Label>Type(*)</Label>
            <div className="flex items-center mt-4">
              <RadioGroup
                // onValueChange={(e) => onFirmChange?.('isPerson', e === 'particulier')}
                defaultValue="entreprise"
                className="block space-y-4 2xl:flex 2xl:space-y-0">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="entreprise" />
                  <Label>Entreprise</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="particulier" />
                  <Label>Particulier</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <div className="mx-1 w-3/5">
            <Label>Numéro d&apos;identification fiscale(*)</Label>
            <Input className="mt-1" placeholder="Ex. 123456789" {...register('taxIdNumber')} />
          </div>
        </div>
        <div className="flex">
          <div className="mt-1 mr-2 w-1/2">
            <Label>Activité</Label>
            <div className="mt-2">
              <Controller
                control={control}
                name="activityId"
                render={({ field }) => {
                  return (
                    <Select onValueChange={field.onChange}>
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
                render={({ field }) => {
                  return (
                    <Select onValueChange={field.onChange}>
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
                render={({ field }) => {
                  return (
                    <Select onValueChange={field.onChange}>
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
