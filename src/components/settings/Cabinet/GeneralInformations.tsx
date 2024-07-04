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
import useCountry from '@/hooks/useCountry';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { UpdateCabinetDto } from '@/api';

interface GeneralInformationsProps {
  className?: string;
  isPending?: boolean;
  register: UseFormRegister<UpdateCabinetDto>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<UpdateCabinetDto, any>;
  watch: (name: string) => string;
}

export const GeneralInformations: React.FC<GeneralInformationsProps> = ({
  className,
  isPending,
  register,
  control,
  watch
}) => {
  const { countries, isFetchCountriesPending } = useCountry();

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
              {...register('enterpriseName')}
            />
          </div>

          <div className="flex justify-between">
            <div className="mt-2 mr-2 w-full">
              <Label>Télephone</Label>
              <Input
                className="mt-2"
                placeholder="Ex. +216 72 398 389"
                isPending={isPending}
                {...register('phone')}
              />
            </div>

            <div className="mt-2 ml-2 w-full">
              <Label>E-mail</Label>
              <Input
                className="mt-2"
                placeholder="Ex. johndoe@zedneycreative.com"
                isPending={isPending}
                {...register('email')}
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
              {...register('address.address')}
            />
          </div>

          <div className="flex justify-between">
            <div className="mt-2 mr-2 w-full">
              <Label>Gouvernorat(*)</Label>
              <Input
                className="mt-2"
                placeholder="Ex. Bizerte"
                isPending={isPending}
                {...register('address.region')}
              />
            </div>

            <div className="mt-2 ml-2 w-full">
              <Label>Code Postal(*)</Label>
              <Input
                className="mt-2"
                placeholder="Ex. 7000"
                isPending={isPending}
                {...register('address.zipcode')}
              />
            </div>

            <div className="mt-2 ml-2 w-full">
              <Label>Pays(*)</Label>
              <div className="mt-2">
                <Controller
                  control={control}
                  name="address.countryId"
                  defaultValue={+watch('address.countryId')}
                  render={({ field }) => {
                    return (
                      <SelectShimmer isPending={isFetchCountriesPending || isPending}>
                        <Select
                          onValueChange={(e) => field.onChange({ target: { value: +e } })}
                          value={field.value ? field.value.toString() : ''}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pays" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.id} value={country?.id?.toString() || ''}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </SelectShimmer>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
