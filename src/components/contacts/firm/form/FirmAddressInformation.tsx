import React from 'react';
import { Country } from '@/api';
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
import { Checkbox } from '@/components/ui/checkbox';
import useAddressInput from '@/hooks/functions/useAddressInput';
import { useTranslation } from 'react-i18next';

interface FirmAddressInformationProps {
  className?: string;
  addressManager: ReturnType<typeof useAddressInput>;
  addressLabel?: string;
  icon?: React.ReactNode;
  countries?: Country[];
  handleCopyAddress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const FirmAddressInformation = React.memo<FirmAddressInformationProps>(
  ({
    className,
    addressManager,
    addressLabel,
    icon,
    countries,
    handleCopyAddress,
    disabled,
    loading
  }) => {
    const { t } = useTranslation('contacts');
    return (
      <Card className={className}>
        <CardHeader className="p-5">
          <CardTitle className="border-b pb-2">
            <div className="flex items-center">
              {icon}
              <Label className="text-sm font-semibold">{addressLabel}</Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Checkbox onClick={handleCopyAddress} disabled={disabled}>
              {addressLabel}
            </Checkbox>
            <Label> {t('firm.duplicate_address_phrase', { address: addressLabel })}</Label>
          </div>

          <div className="mt-3 w-full">
            <div>
              <Label>{t('common.address.address')} (*)</Label>
              <Input
                isPending={loading || false}
                className="mt-1"
                placeholder="Ex. 188 Avenue 14 Janvier"
                disabled={disabled}
                value={addressManager?.address?.address || ''}
                onChange={(e) => addressManager.handleAddressChange('address', e.target.value)}
              />
            </div>
          </div>
          <div className="flex w-full mt-3">
            <div className="w-2/3">
              <Label>{t('common.address.region')} (*)</Label>
              <Input
                isPending={loading || false}
                className="mt-1"
                placeholder="Ex. Bizerte"
                disabled={disabled}
                value={addressManager?.address?.region || ''}
                onChange={(e) => addressManager.handleAddressChange('region', e.target.value)}
              />
            </div>
            <div className="w-1/3 ml-2">
              <Label>{t('common.address.zip_code')} (*)</Label>
              <Input
                isPending={loading || false}
                className="mt-1"
                placeholder="Ex. 7000"
                disabled={disabled}
                value={addressManager?.address?.zipcode || ''}
                onChange={(e) => addressManager.handleAddressChange('zipcode', e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3 w-full">
            <div>
              <Label>{t('common.address.address2')}</Label>
              <Input
                isPending={loading || false}
                className="mt-1"
                placeholder="Ex. 188 Avenue 14 Janvier"
                disabled={disabled}
                value={addressManager?.address?.address2 || ''}
                onChange={(e) => addressManager.handleAddressChange('address2', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-2 mr-2 w-full">
            <Label>{t('common.address.country')}</Label>
            <div className="mt-2">
              <SelectShimmer isPending={loading || false}>
                <Select
                  key={addressManager?.address?.countryId || 'country'}
                  onValueChange={(e) => addressManager.handleAddressChange('countryId', e)}
                  disabled={disabled}
                  value={addressManager?.address?.countryId?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.address.country')} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries?.map((country) => (
                      <SelectItem key={country.id} value={country?.id?.toString() || ''}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SelectShimmer>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

FirmAddressInformation.displayName = 'FirmAddressInformation';
export default FirmAddressInformation;
