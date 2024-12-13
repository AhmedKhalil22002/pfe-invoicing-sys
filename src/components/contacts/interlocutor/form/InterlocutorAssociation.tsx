import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectShimmer,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { useInterlocutorManager } from '../hooks/useInterlocutorManager';
import { cn } from '@/lib/utils';
import { Interlocutor } from '@/types';
import { Input } from '@/components/ui/input';

interface InterlocutorAssociationProps {
  className?: string;
  interlocutors?: Interlocutor[];
  loading?: boolean;
}

export const InterlocutorAssociation: React.FC<InterlocutorAssociationProps> = ({
  className,
  interlocutors,
  loading
}) => {
  const { t: tCommon } = useTranslation('contacts');
  const { t: tInvoicing } = useTranslation('invoicing');

  const interlocutorManager = useInterlocutorManager();
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* interlocutor */}
      <div className="mx-1 w-full">
        <Label>{tCommon('interlocutor.singular')} (*)</Label>
        <SelectShimmer isPending={loading}>
          <Select
            onValueChange={(e) => {
              interlocutorManager.set('id', parseInt(e));
            }}
            value={interlocutorManager?.id?.toString()}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={tInvoicing('invoice.associate_interlocutor')} />
            </SelectTrigger>
            <SelectContent>
              {interlocutors?.map((entry) => (
                <SelectItem
                  key={entry.id || 'interlocutor'}
                  value={entry?.id?.toString() || ''}
                  className="mx-1">
                  {entry.name} {entry.surname}{' '}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SelectShimmer>
      </div>

      <div className="mx-1 w-full">
        <Label>{tCommon('interlocutor.attributes.position')}</Label>
        <Input
          isPending={loading || false}
          className="mt-1"
          placeholder="Ex. CEO"
          value={interlocutorManager && interlocutorManager.position}
          onChange={(e) => {
            interlocutorManager.set('position', e.target.value);
          }}
        />
      </div>
    </div>
  );
};
