import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { Label } from '@/components/ui/label';
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
import { useFirmManager } from '@/hooks/functions/useFirmManager';

interface FirmProfessionalInformationProps {
  className?: string;
  activities?: Activity[];
  currencies?: Currency[];
  paymentConditions?: PaymentCondition[];
  loading?: boolean;
}

const FirmProfessionalInformation: React.FC<FirmProfessionalInformationProps> = ({
  className,
  activities,
  currencies,
  paymentConditions,
  loading
}) => {
  const firmManager = useFirmManager();

  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle className="border-b pb-2">
          <div className="flex items-center">
            <Briefcase className="h-7 w-7 mr-1" />
            <Label className="text-sm font-semibold">Information Professionnelles</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="-mt-1 mx-1 w-2/5">
            <Label>Type(*)</Label>
            <div className="flex items-center mt-4">
              <RadioGroup
                value={firmManager.isPerson ? 'particulier' : 'entreprise'}
                className="block md:flex justify-center items-center"
                onValueChange={(e) => {
                  firmManager.set('isPerson', e === 'particulier');
                }}>
                <div className="flex items-center">
                  <RadioGroupItem value="entreprise" />
                  <Label className="ml-1" isPending={loading || false}>
                    Entreprise
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="particulier" />
                  <Label className="ml-1" isPending={loading || false}>
                    Particulier
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <div className="mx-1 w-3/5">
            <Label>Numéro d&apos;identification fiscale(*)</Label>
            <Input
              isPending={loading || false}
              className="mt-1"
              placeholder="Ex. 123456789"
              value={firmManager.taxIdNumber}
              onChange={(e) => firmManager.set('taxIdNumber', e.target.value)}
            />
          </div>
        </div>
        <div className="flex">
          <div className="mt-1 mr-2 w-1/2">
            <Label>Activité</Label>
            <div className="mt-2">
              <SelectShimmer isPending={loading || false}>
                <Select
                  key={firmManager.activity?.id || 'activity'}
                  onValueChange={(e) => firmManager.set('activity', { id: +e } as Activity)}
                  value={firmManager?.activity?.id?.toString() || undefined}>
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
            </div>
          </div>
          <div className="mt-1 mr-2 w-1/2">
            <Label>Devise</Label>
            <div className="mt-2">
              <SelectShimmer isPending={loading || false}>
                <Select
                  key={firmManager.currency?.id || 'currency'}
                  onValueChange={(e) => firmManager.set('currency', { id: +e } as Currency)}
                  value={firmManager?.currency?.id?.toString() || undefined}>
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
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="mt-2 mr-2 w-full">
            <Label>Conditions de Paiement</Label>
            <div className="mt-1">
              <SelectShimmer isPending={loading || false}>
                <Select
                  key={firmManager.paymentCondition?.id || 'paymentCondition'}
                  onValueChange={(e) =>
                    firmManager.set('paymentCondition', { id: +e } as PaymentCondition)
                  }
                  value={firmManager?.paymentCondition?.id?.toString() || undefined}>
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirmProfessionalInformation;
