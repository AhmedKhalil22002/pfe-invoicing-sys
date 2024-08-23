import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTaxManager } from './hooks/useTaxManager';

interface TaxFormProps {
  className?: string;
}

export const TaxForm = ({ className }: TaxFormProps) => {
  const taxManager = useTaxManager();
  return (
    <div className={className}>
      <div className="mt-4">
        <Label>Titre(*) :</Label>
        <Input
          className="mt-2"
          placeholder="Ex. FODEC"
          name="label"
          value={taxManager?.label}
          onChange={(e) => {
            taxManager.set('label', e.target.value);
          }}
        />
      </div>
      <div className="mt-4">
        <Label>Taux(*) :</Label>
        <Input
          className="mt-2"
          placeholder="Ex. 10"
          name="rate"
          value={(taxManager?.rate || 0) * 100}
          onChange={(e) => taxManager.set('rate', parseFloat(e.target.value) / 100)}
        />
      </div>
      <div className="flex w-full items-center my-5">
        <Label className="w-full">Taxe spéciale </Label>
        <div className="w-full text-right">
          <Switch
            onCheckedChange={() => taxManager.set('isSpecial', !taxManager.isSpecial)}
            checked={taxManager?.isSpecial}
          />
        </div>
      </div>
    </div>
  );
};
