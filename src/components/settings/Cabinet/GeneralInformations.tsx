import React from 'react';
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
import { Building2 } from 'lucide-react';
import { Country } from '@/api';
import { useCabinetManager } from '@/hooks/functions/useCabinetManager';
import useAddressInput from '@/hooks/functions/useAddressInput';

interface GeneralInformationsProps {
  className?: string;
  countries?: Country[];
  addressManager: ReturnType<typeof useAddressInput>;
  isPending?: boolean;
}

export const GeneralInformations: React.FC<GeneralInformationsProps> = ({
  className,
  isPending,
  countries,
  addressManager
}) => {
  const cabinetManager = useCabinetManager();
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
            <Input
              className="mt-2"
              placeholder="Ex. Zedney Creative"
              isPending={isPending}
              value={cabinetManager.enterpriseName}
              onChange={(e) => cabinetManager.set('enterpriseName', e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <div className="mt-2 mr-2 w-full">
              <Label>Télephone</Label>
              <Input
                className="mt-2"
                placeholder="Ex. +216 72 398 389"
                isPending={isPending}
                value={cabinetManager.phone}
                onChange={(e) => cabinetManager.set('phone', e.target.value)}
              />
            </div>

            <div className="mt-2 ml-2 w-full">
              <Label>E-mail</Label>
              <Input
                className="mt-2"
                placeholder="Ex. johndoe@zedneycreative.com"
                isPending={isPending}
                value={cabinetManager.email}
                onChange={(e) => cabinetManager.set('email', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 border-t w-full">
          <div className="mt-2 mr-2 w-full">
            <Label>Adresse(*)</Label>
            <Input
              className="mt-2"
              placeholder="Ex. 188 Avenue 14 Janvier"
              isPending={isPending}
              value={addressManager?.address?.address}
              onChange={(e) => addressManager.handleAddressChange('address', e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <div className="mt-2 mr-2 w-full">
              <Label>Gouvernorat(*)</Label>
              <Input
                className="mt-2"
                placeholder="Ex. Bizerte"
                isPending={isPending}
                value={addressManager?.address?.region}
                onChange={(e) => addressManager.handleAddressChange('region', e.target.value)}
              />
            </div>

            <div className="mt-2 ml-2 w-full">
              <Label>Code Postal(*)</Label>
              <Input
                className="mt-2"
                placeholder="Ex. 7000"
                isPending={isPending}
                value={addressManager?.address?.zipcode}
                onChange={(e) => addressManager.handleAddressChange('zipcode', e.target.value)}
              />
            </div>

            <div className="mt-2 ml-2 w-full">
              <Label>Pays(*)</Label>
              <div className="mt-2">
                <SelectShimmer isPending={isPending}>
                  <Select
                    key={addressManager?.address?.countryId?.toString() || 'countryId'}
                    onValueChange={(e) => addressManager.handleAddressChange('countryId', e)}
                    value={addressManager?.address?.countryId?.toString() || undefined}>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
