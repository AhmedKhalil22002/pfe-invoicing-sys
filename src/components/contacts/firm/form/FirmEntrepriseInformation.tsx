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
import { Activity, Currency, PaymentCondition } from '@/api';
import { useFirmManager } from '@/hooks/functions/useFirmManager';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('contacts');

  const firmManager = useFirmManager();

  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle className="border-b pb-2">
          <div className="flex items-center">
            <Briefcase className="h-7 w-7 mr-1" />
            <Label className="text-sm font-semibold">{t('common.firm_information')}</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mt-2">
          <div className="ml-1 w-2/5">
            <Label>{t('firm.attributes.type')} (*)</Label>
            <div className="flex items-center my-4">
              <RadioGroup
                value={firmManager.isPerson ? 'particulier' : 'entreprise'}
                className="block md:flex justify-center items-center"
                onValueChange={(e) => {
                  firmManager.set('isPerson', e === 'particulier');
                  firmManager.set('taxIdNumber', '');
                }}>
                <div className="flex items-center">
                  <RadioGroupItem value="entreprise" />
                  <Label className="ml-1" isPending={loading || false}>
                    {t('firm.attributes.entreprise_type')}
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="particulier" />
                  <Label className="ml-1" isPending={loading || false}>
                    {t('firm.attributes.particular_entreprise_type')}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          {!firmManager.isPerson && (
            <div className="w-3/5">
              <Label>{t('firm.attributes.tax_number')} (*)</Label>
              <Input
                isPending={loading || false}
                className="mt-1"
                placeholder="Ex. 123456789"
                value={firmManager?.taxIdNumber || ''}
                onChange={(e) => firmManager.set('taxIdNumber', e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="flex mt-2">
          <div className="mr-1 w-1/3">
            <Label>{t('firm.attributes.entreprise_name')} (*)</Label>
            <Input
              isPending={loading || false}
              className="mt-1"
              placeholder="Ex. Zedney Creative"
              value={firmManager?.enterpriseName || ''}
              onChange={(e) => firmManager.set('enterpriseName', e.target.value)}
            />
          </div>
          <div className="mx-1 w-1/3">
            <Label>{t('firm.attributes.website')}</Label>
            <Input
              isPending={loading || false}
              type="url"
              className="mt-1"
              placeholder="Ex. zedneycreative.com"
              value={firmManager?.website || ''}
              onChange={(e) => firmManager.set('website', e.target.value)}
            />
          </div>
          <div className="mx-1 w-1/3">
            <Label>{t('firm.attributes.phone')}</Label>
            <Input
              isPending={loading || false}
              type="tel"
              className="mt-1"
              placeholder="Ex. +216 72 398 389"
              value={firmManager?.entreprisePhone || ''}
              onChange={(e) => firmManager.set('entreprisePhone', e.target.value)}
            />
          </div>
        </div>

        <div className="flex mt-2">
          <div className="mt-1 mr-2 w-1/2">
            <Label>{t('firm.attributes.activity')}</Label>
            <div className="mt-2">
              <SelectShimmer isPending={loading || false}>
                <Select
                  key={firmManager.activity?.id || 'activity'}
                  onValueChange={(e) => firmManager.set('activity', { id: +e } as Activity)}
                  value={firmManager?.activity?.id?.toString() || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('firm.attributes.activity')} />
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
            <Label>{t('firm.attributes.currency')}</Label>
            <div className="mt-2">
              <SelectShimmer isPending={loading || false}>
                <Select
                  key={firmManager.currency?.id || 'currency'}
                  onValueChange={(e) => firmManager.set('currency', { id: +e } as Currency)}
                  value={firmManager?.currency?.id?.toString() || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('firm.attributes.currency')} />
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
        <div className="flex mt-2">
          <div className="mr-2 w-full">
            <Label>{t('firm.attributes.payment_conditions')}</Label>
            <div className="mt-1">
              <SelectShimmer isPending={loading || false}>
                <Select
                  key={firmManager.paymentCondition?.id || 'paymentCondition'}
                  onValueChange={(e) =>
                    firmManager.set('paymentCondition', { id: +e } as PaymentCondition)
                  }
                  value={firmManager?.paymentCondition?.id?.toString() || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('firm.attributes.payment_conditions')} />
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
