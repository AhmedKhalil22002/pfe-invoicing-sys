import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Currency, Tax } from '@/api';
import { Controller } from 'react-hook-form';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ArticleFormItemProps {
  className?: string;
  taxes: Tax[];
  currencySymbol?: string;
  register: any;
  control: any;
  watch: any;
}

export const ArticleFormItem: React.FC<ArticleFormItemProps> = ({
  className,
  taxes,
  currencySymbol,
  register,
  control,
  watch
}) => {
  return (
    <div className={cn(className, 'flex flex-row w-full gap-3 items-center')}>
      <div className="w-3/12">
        <Input className="mt-2" placeholder="Description" />
      </div>
      <div className="w-2/12">
        <Input className="mt-2" placeholder="0" />
      </div>
      <div className="w-3/12 ">
        <Input className="mt-2" placeholder="0" />
        <div className="mt-2">
          <Label className="font-thin mx-1">Remise</Label>
          <Input className="mt-2" placeholder="0" />
        </div>
      </div>
      <div className="w-2/12">
        <Controller
          control={control}
          name={`tax`}
          // defaultValue={+(watch() || 0)}
          render={({ field }) => {
            return (
              <Select
                onValueChange={field.onChange}
                value={field.value ? field.value.toString() : ''}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="0%" />
                </SelectTrigger>
                <SelectContent className="p-2">
                  {taxes?.map((tax: Tax) => {
                    return (
                      <SelectItem key={tax.id} value={tax?.rate?.toString() || ''}>
                        {tax?.label}%
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            );
          }}
        />
        <Button className="mt-2 w-full">Ajouter</Button>
      </div>
      <div className="w-2/12 text-center">
        <Label>0.000 {currencySymbol}</Label>
      </div>
    </div>
  );
};
