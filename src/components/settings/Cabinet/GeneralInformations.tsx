import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputShimmer } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectShimmer,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Building2 } from 'lucide-react';
import { Cabinet } from '@/api/types/cabinet';
import useCountry from '@/hooks/useCountry';

interface GeneralInformationsProps {
  className?: string;
  cabinet?: Cabinet;
  isPending: boolean;
  onCabinetChange: (updatedCabinet: Partial<Cabinet>) => void;
}

export const GeneralInformations: React.FC<GeneralInformationsProps> = ({
  className,
  cabinet = {} as Cabinet,
  isPending,
  onCabinetChange
}) => {
  const { countries, isFetchCountriesPending } = useCountry();

  const handleChange = (field: string, value: string | number) => {
    onCabinetChange({ ...cabinet, [field]: value });
  };

  const handleAddressChange = (field: string, value: string | number | { id: number }) => {
    onCabinetChange({
      ...cabinet,
      address: { ...cabinet.address, [field]: value }
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center">
            <Building2 className="h-6 w-6 mr-2" />
            Informations Générales
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="mt-2">
            <Label>Nom du Cabinet(*)</Label>
            <InputShimmer
              className="mt-2"
              placeholder="Ex. Zedney Creative"
              value={cabinet.enterpriseName || ''}
              onChange={(e) => handleChange('enterpriseName', e.target.value)}
              isPending={isPending}
            />
          </div>

          <div className="flex justify-between">
            <div className="mt-2 mr-2 w-full">
              <Label>Télephone</Label>
              <InputShimmer
                className="mt-2"
                placeholder="Ex. +216 72 398 389"
                value={cabinet.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                isPending={isPending}
              />
            </div>

            <div className="mt-2 ml-2 w-full">
              <Label>E-mail</Label>
              <InputShimmer
                className="mt-2"
                placeholder="Ex. johndoe@zedneycreative.com"
                value={cabinet.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                isPending={isPending}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 border-t w-full">
          <div className="mt-2 mr-2 w-full">
            <Label>Adresse(*)</Label>
            <InputShimmer
              className="mt-2"
              placeholder="Ex. 188 Avenue 14 Janvier"
              value={cabinet.address?.address || ''}
              onChange={(e) => handleAddressChange('address', e.target.value)}
              isPending={isPending}
            />
          </div>

          <div className="flex justify-between">
            <div className="mt-2 mr-2 w-full">
              <Label>Gouvernorat(*)</Label>
              <InputShimmer
                className="mt-2"
                placeholder="Ex. Bizerte"
                value={cabinet.address?.region || ''}
                onChange={(e) => handleAddressChange('region', e.target.value)}
                isPending={isPending}
              />
            </div>

            <div className="mt-2 ml-2 w-full">
              <Label>Code Postal(*)</Label>
              <InputShimmer
                className="mt-2"
                placeholder="Ex. 7000"
                value={cabinet.address?.zipcode || ''}
                onChange={(e) => handleAddressChange('zipcode', e.target.value)}
                isPending={isPending}
              />
            </div>

            <div className="mt-2 ml-2 w-full">
              <Label>Pays(*)</Label>
              <div className="mt-2">
                <SelectShimmer isPending={isFetchCountriesPending || isPending}>
                  <Select
                    value={cabinet.address?.country?.id?.toString() || ''}
                    onValueChange={(value) =>
                      handleAddressChange('country', { id: parseInt(value) })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Pays" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id.toString()}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SelectShimmer>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
