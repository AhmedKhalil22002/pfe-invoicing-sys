import React from 'react';
import { Firm } from '@/api/types/firm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectShimmer,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SocialTitles } from '@/api/types/social-titles';
import { Input } from '@/components/ui/input';

interface FirmGeneralInformationsProps {
  className?: string;
  firm?: Firm;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onFirmChange?: Function;
}

export const FirmGeneralInformations: React.FC<FirmGeneralInformationsProps> = ({
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle>
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
              <SelectShimmer isPending={false}>
                <Select
                // value={cabinet.address?.country?.id?.toString() || ''}
                // onValueChange={(value) =>
                //   handleAddressChange('country', { id: parseInt(value) })
                // }
                >
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
              </SelectShimmer>
            </div>
          </div>
          <div className="mx-1 w-2/5">
            <Label>Prénom (*)</Label>
            <Input className="mt-1" name="name" placeholder="Ex. John" />
          </div>
          <div className="mx-1 w-2/5">
            <Label>Nom de famille (*)</Label>
            <Input className="mt-1" name="surname" placeholder="Ex. Doe" />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="mx-1 w-3/5">
            <Label>Nom de l&apos;entreprise (*)</Label>
            <Input className="mt-1" name="firmName" placeholder="Ex. Zedney Creative" />
          </div>
          <div className="mx-1 w-2/5">
            <Label>Site Internet</Label>
            <Input className="mt-1" name="website" placeholder="Ex. zedneycreative.com" />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="mx-1 w-3/5">
            <Label>E-mail</Label>
            <Input className="mt-1" name="email" placeholder="Ex. johndoe@zedneycreative.com" />
          </div>
          <div className="mx-1 w-2/5">
            <Label>Téléphone</Label>
            <Input className="mt-1" name="label" placeholder="Ex. +216 72 398 389" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
