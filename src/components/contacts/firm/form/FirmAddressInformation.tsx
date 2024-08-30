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
import useAddressInput from '@/hooks/functions/useAddressInput';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface FirmAddressInformationProps {
  className?: string;
  addressManager: ReturnType<typeof useAddressInput>;
  addressLabel?: string;
  otherAddressLabel?: string;
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
    otherAddressLabel,
    icon,
    countries,
    handleCopyAddress,
    disabled,
    loading
  }) => {
    const { t: tCommon } = useTranslation('common');

    const { t: tContacts } = useTranslation('contacts');

    return (
      <Card className={className}>
        <CardHeader className="p-5">
          <CardTitle className="border-b pb-2">
            <div className="flex items-center">
              {icon}
              <Label className="text-sm font-semibold">{tContacts(addressLabel || '')}</Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-3 w-full">
            <Label
              className="flex items-center gap-2 underline my-2 justify-end cursor-pointer"
              onClick={handleCopyAddress}>
              <Copy />
              {tCommon('commands.copy')} {tContacts(otherAddressLabel || '')}
            </Label>

            <div>
              <Label>{tContacts('common.address.address')} (*)</Label>
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
          <div className="mt-3 w-full">
            <div>
              <Label>{tContacts('common.address.address2')}</Label>
              <Input
                isPending={loading || false}
                className="mt-1"
                placeholder="Ex. 188 Avenue 14 Janvier"
                disabled={disabled}
                value={addressManager?.address?.address2 || ''}
                onChange={(e) => addressManager.handleAddressChange('address2', e.target.value)}
              />
            </div>
            <div className="flex w-full mt-3">
              <div className="w-2/3">
                <Label>{tContacts('common.address.region')} (*)</Label>
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
                <Label>{tContacts('common.address.zip_code')} (*)</Label>
                <Input
                  type="number"
                  isPending={loading || false}
                  className="mt-1"
                  placeholder="Ex. 7000"
                  disabled={disabled}
                  value={addressManager?.address?.zipcode || 0}
                  onChange={(e) => addressManager.handleAddressChange('zipcode', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-2 mr-2 w-full">
            <Label>{tContacts('common.address.country')}</Label>
            <div className="mt-2">
              <SelectShimmer isPending={loading || false}>
                <Select
                  key={addressManager?.address?.countryId || 'country'}
                  onValueChange={(e) => addressManager.handleAddressChange('countryId', e)}
                  disabled={disabled}
                  value={addressManager?.address?.countryId?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder={tContacts('common.address.country')} />
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
