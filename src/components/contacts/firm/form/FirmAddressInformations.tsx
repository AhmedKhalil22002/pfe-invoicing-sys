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

interface FirmAddressInformationsProps {
  className?: string;
  addressPrefix: 'invoicingAddress' | 'deliveryAddress';
  addressLabel?: string;
  icon?: React.ReactNode;
  countries?: Country[];
  register: UseFormRegister<CreateFirmDto>;

  control: Control<CreateFirmDto, any>;
  watch: (name: string) => string;
  handleCopyAddress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const FirmAddressInformations = React.memo(
  ({
    className,
    addressPrefix,
    addressLabel,
    icon,
    countries,
    register,
    control,
    watch,
    handleCopyAddress,
    disabled,
    loading
  }: FirmAddressInformationsProps) => {
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
              <Label>Address </Label>
              <Input
                isPending={loading || false}
                className="mt-1"
                placeholder="Ex. 188 Avenue 14 Janvier"
                disabled={disabled}
                {...register(`${addressPrefix}.address`)}
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
                {...register(`${addressPrefix}.region`)}
              />
            </div>
            <div className="w-1/3 ml-2">
              <Label>Code Postal (*)</Label>
              <Input
                isPending={loading || false}
                className="mt-1"
                placeholder="Ex. 7000"
                disabled={disabled}
                {...register(`${addressPrefix}.zipcode`)}
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
                {...register(`${addressPrefix}.address2`)}
              />
            </div>
          </div>

          <div className="mt-2 mr-2 w-full">
            <Label>Pays</Label>
            <div className="mt-2">
              <Controller
                control={control}
                name={`${addressPrefix}.countryId`}
                defaultValue={+watch(`${addressPrefix}.countryId`)}
                render={({ field }) => (
                  <SelectShimmer isPending={loading || false}>
                    <Select
                      onValueChange={field.onChange}
                      disabled={disabled}
                      value={field.value ? field.value.toString() : ''}>
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
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

FirmAddressInformations.displayName = 'FirmAddressInformations';
export default FirmAddressInformations;
