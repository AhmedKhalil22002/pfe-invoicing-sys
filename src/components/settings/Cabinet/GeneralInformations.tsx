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
import { Building2 } from 'lucide-react';

interface GeneralInformationsProps {
  className?: string;
}

export const GeneralInformations = ({ className }: GeneralInformationsProps) => {
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
            <Input className="mt-2" placeholder="Ex. Zedney Creative" />
          </div>

          <div className="flex justify-between">
            <div className="mt-2 mr-2 w-full">
              <Label>Télephone</Label>
              <Input className="mt-2" placeholder="Ex. +216 72 398 389" />
            </div>

            <div className="mt-2 ml-2 w-full">
              <Label>E-mail</Label>
              <Input className="mt-2" placeholder="Ex. johndoe@zedneycreative.com" />
            </div>
          </div>
        </div>

        <div className="mt-4 border-t w-full">
          <div className="mt-2 mr-2 w-full">
            <Label>Adresse(*)</Label>
            <Input className="mt-2" placeholder="Ex. 188 Avenue 14 Janvier" />
          </div>

          <div className="flex justify-between">
            <div className="mt-2 mr-2 w-full">
              <Label>Gouvernorat(*)</Label>
              <Input className="mt-2" placeholder="Ex. Bizerte" />
            </div>

            <div className="mt-2 ml-2 w-full">
              <Label>Code Postal(*)</Label>
              <Input className="mt-2" placeholder="Ex. 7000" />
            </div>

            <div className="mt-2 ml-2 w-full">
              <Label>Pays(*)</Label>
              <div className="mt-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="en">Tunisie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
