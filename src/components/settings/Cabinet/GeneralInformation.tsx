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
import { useCabinetManager } from '@/components/settings/Cabinet/hooks/useCabinetManager';
import useAddressInput from '@/hooks/functions/useAddressInput';
import { PhoneInput } from '@/components/ui/phone-input';
import Image from 'next/image';
import logo from 'src/assets/zedney_creative_logo.png';
import { FileUploader } from '@/components/ui/file-uploader';
import { useTranslation } from 'react-i18next';

interface GeneralInformationProps {
  className?: string;
  countries?: Country[];
  addressManager: ReturnType<typeof useAddressInput>;
  isPending?: boolean;
}

export const GeneralInformation: React.FC<GeneralInformationProps> = ({
  className,
  isPending,
  countries,
  addressManager
}) => {
  const cabinetManager = useCabinetManager();
  const { t: tCountry } = useTranslation('country');
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center">
            <Building2 className="h-6 w-6 mr-2" />
            Information Générales
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          {/* General Information */}
          <div className="w-3/4">
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
                  <PhoneInput
                    className="mt-2"
                    defaultCountry="TN"
                    placeholder="Ex. +216 72 398 389"
                    isPending={isPending || false}
                    value={cabinetManager.phone}
                    onChange={(value) => cabinetManager.set('phone', value)}
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
                              {country?.alpha2code && tCountry(country?.alpha2code)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </SelectShimmer>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center w-1/4">
            <div>
              <Label>Logo :</Label>
              <Image src={logo} alt="logo" className="my-1 rounded-lg w-32 h-32" />
            </div>
            <div>
              <Label>Signature :</Label>
              <Image src={logo} alt="logo" className="my-1 rounded-lg w-32 h-32" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
