import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SocialTitles } from '@/api/enums/social-titles';
import { Input } from '@/components/ui/input';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { CreateFirmDto } from '@/api';

interface FirmGeneralInformationsProps {
  className?: string;
  register: UseFormRegister<CreateFirmDto>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<CreateFirmDto, any>;
}

const FirmGeneralInformations = ({
  className,
  register,
  control
}: FirmGeneralInformationsProps) => {
  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle className="border-b">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            <Label className="text-sm font-semibold">Information Général</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="-mt-1 mx-1 w-1/5">
            <Label>Titre(*)</Label>
            <div className="mt-2">
              <Controller
                control={control}
                name="mainInterlocutor.title"
                render={({ field }) => {
                  return (
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Titre" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SocialTitles).map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </div>
          </div>
          <div className="mx-1 w-2/5">
            <Label>Prénom (*)</Label>
            <Input className="mt-1" placeholder="Ex. John" {...register('mainInterlocutor.name')} />
          </div>
          <div className="mx-1 w-2/5">
            <Label>Nom de famille (*)</Label>
            <Input
              className="mt-1"
              placeholder="Ex. Doe"
              {...register('mainInterlocutor.surname')}
            />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="mx-1 w-3/5">
            <Label>Nom de l&apos;entreprise (*)</Label>
            <Input className="mt-1" placeholder="Ex. Zedney Creative" {...register('name')} />
          </div>
          <div className="mx-1 w-2/5">
            <Label>Site Internet</Label>
            <Input
              type="url"
              className="mt-1"
              placeholder="Ex. zedneycreative.com"
              {...register('website')}
            />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="mx-1 w-3/5">
            <Label>E-mail</Label>
            <Input
              type="email"
              className="mt-1"
              placeholder="Ex. johndoe@zedneycreative.com"
              {...register('mainInterlocutor.email')}
            />
          </div>
          <div className="mx-1 w-2/5">
            <Label>Téléphone</Label>
            <Input
              type="number"
              className="mt-1"
              placeholder="Ex. +216 72 398 389"
              {...register('mainInterlocutor.phone')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirmGeneralInformations;
