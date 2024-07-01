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
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Control, Controller, UseFormRegister } from 'react-hook-form';

interface FirmAddressInformationsProps {
  className?: string;
  addressPrefix: 'invoicingAddress' | 'deliveryAddress';
  addressLabel1?: string;
  addressLabel2?: string;
  icon?: React.ReactNode;
  countries?: Country[];
  register: UseFormRegister<CreateFirmDto>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<CreateFirmDto, any>;
  watch: (name: string) => string;
  handleCopyAddress: () => void;
}

const FirmAddressInformations = React.memo(
  ({
    className,
    addressPrefix,
    addressLabel1,
    addressLabel2,
    icon,
    countries,
    register,
    control,
    watch,
    handleCopyAddress
  }: FirmAddressInformationsProps) => {
    const memoizedCopyAddress = React.useCallback(handleCopyAddress, [handleCopyAddress]);

    return (
      <Card className={className}>
        <CardHeader className="p-5">
          <CardTitle className="border-b">
            <div className="flex items-center">
              {icon}
              <Label className="text-sm font-semibold">{addressLabel1}</Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="cursor-pointer hover:underline" onClick={memoizedCopyAddress}>
            Copier l&apos;address {addressLabel2}
          </Label>
          <div className="mt-3 w-full">
            <div>
              <Label>Address </Label>
              <Input
                className="mt-1"
                placeholder="Ex. 188 Avenue 14 Janvier"
                {...register(`${addressPrefix}.address`)}
              />
            </div>
          </div>
          <div className="flex w-full mt-3">
            <div className="w-2/3">
              <Label>Gouvernorat (*)</Label>
              <Input
                className="mt-1"
                placeholder="Ex. Bizerte"
                {...register(`${addressPrefix}.region`)}
              />
            </div>
            <div className="w-1/3 ml-2">
              <Label>Code Postal (*)</Label>
              <Input
                className="mt-1"
                placeholder="Ex. 7000"
                {...register(`${addressPrefix}.zipcode`)}
              />
            </div>
          </div>
          <div className="mt-3 w-full">
            <div>
              <Label>Address 2</Label>
              <Input
                className="mt-1"
                placeholder="Ex. 188 Avenue 14 Janvier"
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
                  <Select
                    onValueChange={field.onChange}
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
