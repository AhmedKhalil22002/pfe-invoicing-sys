import React from 'react';
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
import { SOCIAL_TITLES } from '@/api';
import { Input } from '@/components/ui/input';
import { useInterlocutorManager } from '@/hooks/functions/useInterlocutorManager';
interface InterlocutorGeneralInformationProps {
  className?: string;
  loading?: boolean;
}

export const InterlocutorGeneralInformation: React.FC<InterlocutorGeneralInformationProps> = ({
  className,
  loading
}) => {
  const interlocutorManager = useInterlocutorManager();

  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle className="border-b pb-2">
          <div className="flex items-center">
            <User className="h-7 w-7 mr-1" />
            <Label className="text-sm font-semibold">Information Général</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="-mt-1 mx-1 w-1/5">
            <Label>Titre(*)</Label>
            <div className="mt-2">
              <SelectShimmer isPending={loading || false}>
                <Select
                  onValueChange={(e) => {
                    interlocutorManager.set('title', e);
                  }}
                  value={interlocutorManager.title}>
                  <SelectTrigger>
                    <SelectValue placeholder="Titre" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SOCIAL_TITLES).map((title) => (
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
            <Input
              isPending={loading || false}
              className="mt-1"
              placeholder="Ex. John"
              value={interlocutorManager.name}
              onChange={(e) => interlocutorManager.set('name', e.target.value)}
            />
          </div>
          <div className="mx-1 w-2/5">
            <Label>Nom de famille (*)</Label>
            <Input
              isPending={loading || false}
              className="mt-1"
              placeholder="Ex. Doe"
              value={interlocutorManager.surname}
              onChange={(e) => interlocutorManager.set('surname', e.target.value)}
            />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="mx-1 w-3/5">
            <Label>E-mail</Label>
            <Input
              isPending={loading || false}
              type="email"
              className="mt-1"
              placeholder="Ex. johndoe@zedneycreative.com"
              value={interlocutorManager.email}
              onChange={(e) => interlocutorManager.set('email', e.target.value)}
            />
          </div>
          <div className="mx-1 w-2/5">
            <Label>Téléphone</Label>
            <Input
              isPending={loading || false}
              type="tel"
              className="mt-1"
              placeholder="Ex. +216 72 398 389"
              value={interlocutorManager.phone}
              onChange={(e) => interlocutorManager.set('phone', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
