import React from 'react';
import { Tax } from '@/api/types/tax';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface TaxFormProps {
  className?: string;
  tax: Tax | null;
  onTaxChange: (tax: Tax) => void;
}

export const TaxForm = ({ className, tax, onTaxChange }: TaxFormProps) => {
  return (
    <div className={className}>
      <div className="mt-4">
        <Label>Titre(*)</Label>
        <Input
          className="mt-2"
          placeholder="Ex. FODEC"
          name="label"
          value={tax?.label}
          onChange={(e) => {
            tax &&
              onTaxChange({
                ...tax,
                [e.target.name]: e.target.value || ''
              });
          }}
        />
      </div>
      <div className="mt-4">
        <Label>Taux(*)</Label>
        <Input
          className="mt-2"
          placeholder="Ex. 10"
          name="rate"
          value={tax?.rate ? tax.rate * 100 : 0}
          onChange={(e) =>
            tax &&
            onTaxChange({
              ...tax,
              [e.target.name]: +e.currentTarget.value / 100
            })
          }
        />
      </div>
      <div className="mt-4">
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="special"
            name="isSpecial"
            checked={tax?.isSpecial}
            onClick={() => tax && onTaxChange({ ...tax, isSpecial: !tax?.isSpecial })}
          />
          <Label htmlFor="special">Taxe spéciale (*)</Label>
        </div>
      </div>
    </div>
  );
};
