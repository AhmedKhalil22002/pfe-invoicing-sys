import { Country } from '@/api/types/country';
import { Firm } from '@/api/types/firm';
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
import React from 'react';

interface FirmAddressInformationsProps {
  className?: string;
  firm?: Firm;
  isPending?: boolean;
  addressLabel1?: string;
  addressLabel2?: string;
  icon?: React.ReactNode;
  countries?: Country[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  onFirmChange?: Function;
}

export const FirmAddressInformations: React.FC<FirmAddressInformationsProps> = ({
  className,
  addressLabel1,
  addressLabel2,
  icon,
  countries
}) => {

  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle>
          <div className="flex items-center">
            {icon}
            <Label className="text-sm font-semibold">{addressLabel1}</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Label className="cursor-pointer hover:underline">
          Copier l&apos;address {addressLabel2}
        </Label>
        <div className="mt-3 w-full">
          <div>
            <Label>Address </Label>
            <Input className="mt-1" name="address" placeholder="Ex. 188 Avenue 14 Janvier" />
          </div>
        </div>
        <div className="flex w-full mt-3">
          <div className="w-2/3">
            <Label>Gouvernorat (*)</Label>
            <Input className="mt-1" name="region" placeholder="Ex. Bizerte" />
          </div>
          <div className="w-1/3 ml-2">
            <Label>Code Postal (*)</Label>
            <Input className="mt-1" name="address" placeholder="Ex. 7000" />
          </div>
        </div>
        <div className="mt-3 w-full">
          <div>
            <Label>Address </Label>
            <Input className="mt-1" name="address" placeholder="Ex. 188 Avenue 14 Janvier" />
          </div>
        </div>

        <div className="mt-2 mr-2 w-full">
          <Label>Pays</Label>
          <div className="mt-2">
            <Select
            // value={cabinet.currency?.id.toString() || ''}
            // onValueChange={(value) => handleChange('currency', { id: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pays" />
              </SelectTrigger>
              <SelectContent>
                {countries?.map((country) => (
                  <SelectItem key={country.id} value={country.id.toString()}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
