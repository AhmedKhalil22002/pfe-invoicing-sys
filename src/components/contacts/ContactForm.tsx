import React from 'react';
import { Activity } from '@/api/types/activity';
import { Label } from '@/components/ui/label';
import { Firm } from '@/api/types/firm';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { User, Briefcase, Package, ReceiptText } from 'lucide-react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectShimmer, SelectTrigger, SelectValue } from '../ui/select';

interface FirmFormProps {
  className?: string;
  activity?: Activity | null;
  onFirmChange?: (firm: Firm) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FirmForm = ({ className, activity, onFirmChange }: FirmFormProps) => {
  return (
    <div className={cn(className, 'grid grid-cols-2 gap-4')}>
      <Card>
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
                      {/* {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id.toString()}>
                          {country.name}
                        </SelectItem>
                      ))} */}
                    </SelectContent>
                  </Select>
                </SelectShimmer>
              </div>
            </div>
            <div className="mx-1 w-2/5">
              <Label>Prénom (*)</Label>
              <Input className="mt-1" name="label" value={activity?.label} />
            </div>
            <div className="mx-1 w-2/5">
              <Label>Nom de famille (*)</Label>
              <Input className="mt-1" name="label" value={activity?.label} />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-5">
          <CardTitle>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              <Label className="text-sm font-semibold">Informations Professionnelles</Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h1>Undress 1</h1>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-5">
          <CardTitle>
            <div className="flex items-center">
              <ReceiptText className="h-5 w-5 mr-2" />
              <Label className="text-sm font-semibold">Adresse De Facturation</Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h1>Undress 1</h1>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-5">
          <CardTitle>
            <div className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              <Label className="text-sm font-semibold">Adresse De Livraison</Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h1>Undress 1</h1>
        </CardContent>
      </Card>
    </div>
  );
};
