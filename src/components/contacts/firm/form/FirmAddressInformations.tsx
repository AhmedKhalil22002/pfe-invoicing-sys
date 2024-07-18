import React from 'react';
import { CreateFirmDto } from '@/api';
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
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { useFirmManager } from '@/hooks/functions/useFirmManager';
import useAddressInput from '@/hooks/functions/useAddressInput';

interface FirmAddressInformationsProps {
  className?: string;
  addressManager: ReturnType<typeof useAddressInput>;
  addressLabel?: string;
  icon?: React.ReactNode;
  countries?: Country[];
  handleCopyAddress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const FirmAddressInformations = React.memo<FirmAddressInformationsProps>(
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
            <Label>Utiliser l&apos;{addressLabel} pour toutes les adresses</Label>
          </div>

          <div className="mt-3 w-full">
            <div>
              <Label>Adresse (*)</Label>
              <Input
                isPending={loading || false}
                className="mt-1"
                placeholder="Ex. 188 Avenue 14 Janvier"
                disabled={disabled}
                value={addressManager?.address?.address}
                onChange={(e) => addressManager.handleAddressChange('address', e.target.value)}
              />
            </div>
          </div>
          <div className="flex w-full mt-3">
            <div className="w-2/3">
              <Label>Gouvernorat (*)</Label>
              <Input
                isPending={loading || false}
                className="mt-1"
                placeholder="Ex. Bizerte"
                disabled={disabled}
                value={addressManager?.address?.region}
                onChange={(e) => addressManager.handleAddressChange('region', e.target.value)}
              />
            </div>
            <div className="w-1/3 ml-2">
              <Label>Code Postal (*)</Label>
              <Input
                isPending={loading || false}
                className="mt-1"
                placeholder="Ex. 7000"
                disabled={disabled}
                value={addressManager?.address?.zipcode}
                onChange={(e) => addressManager.handleAddressChange('zipcode', e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3 w-full">
            <div>
              <Label>Address 2</Label>
              <Input
                isPending={loading || false}
                className="mt-1"
                placeholder="Ex. 188 Avenue 14 Janvier"
                disabled={disabled}
                value={addressManager?.address?.address2}
                onChange={(e) => addressManager.handleAddressChange('address2', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-2 mr-2 w-full">
            <Label>Pays</Label>
            <div className="mt-2">
              <SelectShimmer isPending={loading || false}>
                <Select
                  key={addressManager?.address?.countryId || 'country'}
                  onValueChange={(e) => addressManager.handleAddressChange('countryId', e)}
                  disabled={disabled}
                  value={addressManager?.address?.countryId?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pays" />
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

FirmAddressInformations.displayName = 'FirmAddressInformations';
export default FirmAddressInformations;
