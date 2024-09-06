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
import { SOCIAL_TITLE } from '@/api';
import { Input } from '@/components/ui/input';
import { useInterlocutorManager } from '@/hooks/functions/useInterlocutorManager';
import { useTranslation } from 'react-i18next';
import { PhoneInput } from '@/components/ui/phone-input';
interface InterlocutorContactInformationProps {
  className?: string;
  loading?: boolean;
  firmId?: number;
}

export const InterlocutorContactInformation: React.FC<InterlocutorContactInformationProps> = ({
  className,
  loading,
  firmId
}) => {
  const { t } = useTranslation('contacts');

  const interlocutorManager = useInterlocutorManager();
  // If firmId is present, only the first entry in InterlocutorCreateForm will be used.
  // The following useEffect will initialize the firmId property of the first entry.
  React.useEffect(() => {
    if (firmId) interlocutorManager.update({ ...interlocutorManager.entries[0], firmId });
  }, [firmId]);

  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle className="border-b pb-2">
          <div className="flex items-center">
            <User className="h-7 w-7 mr-1" />
            <Label className="text-sm font-semibold">{t('common.contact_information')}</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="-mt-1 mx-1 w-1/5">
            <Label>{t('interlocutor.attributes.title')} (*)</Label>
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
                    {Object.values(SOCIAL_TITLE).map((title) => (
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
            <Label>{t('interlocutor.attributes.name')} (*)</Label>
            <Input
              isPending={loading || false}
              className="mt-1"
              placeholder="Ex. John"
              value={interlocutorManager.name}
              onChange={(e) => interlocutorManager.set('name', e.target.value)}
            />
          </div>
          <div className="mx-1 w-2/5">
            <Label>{t('interlocutor.attributes.surname')} (*)</Label>
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
            <Label>{t('interlocutor.attributes.email')}</Label>
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
            <Label>{t('interlocutor.attributes.phone')}</Label>
            <PhoneInput
              isPending={loading || false}
              type="tel"
              defaultCountry="TN"
              className="mt-1"
              placeholder="Ex. +216 72 398 389"
              value={interlocutorManager.phone}
              onChange={(value) => interlocutorManager.set('phone', value)}
            />
          </div>
        </div>
        {firmId && (
          <div className="flex mt-2">
            <div className="mx-1 w-full">
              <Label>{t('interlocutor.attributes.position')}</Label>
              <Input
                isPending={loading || false}
                className="mt-1"
                placeholder="Ex. CEO"
                value={interlocutorManager.entries && interlocutorManager.entries[0]?.position}
                onChange={(e) => {
                  interlocutorManager.update({
                    ...interlocutorManager.entries[0],
                    position: e.target.value
                  });
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
