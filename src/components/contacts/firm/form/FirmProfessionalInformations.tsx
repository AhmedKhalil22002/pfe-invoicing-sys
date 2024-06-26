import React from 'react';
import { Firm } from '@/api/types/firm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Activity } from '@/api/types/activity';
import { Currency } from '@/api/types/currency';

interface FirmProfessionalInformationsProps {
  className?: string;
  firm?: Firm;
  activities?: Activity[];
  currencies?: Currency[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  onFirmChange?: Function;
}

export const FirmProfessionalInformations: React.FC<FirmProfessionalInformationsProps> = ({
  className,
  activities,
  currencies,
}) => {
  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle  className='border-b'>
          <div className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            <Label className="text-sm font-semibold">Informations Professionnelles</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="-mt-1 mx-1 w-2/5">
            <Label>Type(*)</Label>
            <div className="flex items-center mt-4">
              <RadioGroup
                defaultValue="entreprise"
                className="block space-y-4 2xl:flex 2xl:space-y-0">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="entreprise" />
                  <Label htmlFor="r1">Entreprise</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="particulier" />
                  <Label htmlFor="r2">Particulier</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <div className="mx-1 w-3/5">
            <Label>Numéro d&apos;identification fiscale(*)</Label>
            <Input className="mt-1" name="taxIdNumber" placeholder="Ex. 123456789" />
          </div>
        </div>
        <div className="flex">
          <div className="mt-2 mr-2 w-1/2">
            <Label>Activité</Label>
            <div className="mt-2">
              <Select
              // value={cabinet.activity?.id.toString() || ''}
              // onValueChange={(value) => handleChange('activity', { id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Activité" />
                </SelectTrigger>
                <SelectContent>
                  {activities?.map((activity) => (
                    <SelectItem key={activity.id} value={activity.id.toString()}>
                      {activity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-2 mr-2 w-1/2">
            <Label>Devise</Label>
            <div className="mt-2">
              <Select
              // value={cabinet.activity?.id.toString() || ''}
              // onValueChange={(value) => handleChange('activity', { id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Devise" />
                </SelectTrigger>
                <SelectContent>
                  {currencies?.map((currency) => (
                    <SelectItem key={currency.id} value={currency.id.toString()}>
                      {currency.label} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="mt-2 mr-2 w-full">
            <Label>Conditions De Paiement</Label>
            <div className="">
              <Select
              // value={cabinet.activity?.id.toString() || ''}
              // onValueChange={(value) => handleChange('activity', { id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Conditions De Paiement" />
                </SelectTrigger>
                <SelectContent></SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
