import { DATE_FORMAT } from '@/api/enums/date-formats';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSequentialsManager } from './hooks/useSequentialManager';

interface SequentialItemProps {
  className?: string;
  id?: number;
  title: string;
  prefix?: string;
  dynamicSequence?: DATE_FORMAT;
  nextNumber?: number;
  loading?: boolean;
  onSequenceChange?: (value: DATE_FORMAT) => void;
}

export const SequentialItem: React.FC<SequentialItemProps> = ({
  className,
  id,
  title,
  prefix,
  dynamicSequence,
  nextNumber,
  loading,
  onSequenceChange
}) => {
  const { t } = useTranslation('common');

  const sequenceOptions = {
    [DATE_FORMAT.yyyy]: 'yyyy',
    [DATE_FORMAT.yy_MM]: 'yy-MM',
    [DATE_FORMAT.yyyy_MM]: 'yyyy-MM'
  };
  const sequentialsManager = useSequentialsManager();

  return (
    <div className={cn('p-4', className)}>
      <Label className="text-lg underline">{title}</Label>
      <div className="mt-4">
        <Label className="text-sm my-1">Préfixe :</Label>
        <Input
          isPending={loading}
          value={prefix}
          onChange={(e) => {
            sequentialsManager.set(id || 0, 'prefix', e.target.value);
          }}
        />
      </div>
      <div className="mt-4">
        <Label className="text-sm my-1">Séquence Dynamique :</Label>
        <Select
          defaultValue={dynamicSequence}
          onValueChange={(value) => {
            sequentialsManager.set(id || 0, 'dynamicSequence', value);
          }}>
          <SelectTrigger>
            <SelectValue placeholder={sequenceOptions[dynamicSequence || DATE_FORMAT.yyyy]} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(sequenceOptions).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4">
        <Label className="text-sm my-1">Numéro Suivant :</Label>
        <Input
          type="number"
          isPending={loading}
          value={nextNumber}
          onChange={(e) => {
            sequentialsManager.set(id || 0, 'next', e.target.value);
          }}
        />
      </div>
    </div>
  );
};
