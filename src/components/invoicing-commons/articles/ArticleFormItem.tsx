import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  ArticleInvoiceEntry,
  ArticleQuotationEntry,
  CreateQuotationDto,
  Currency,
  Tax
} from '@/api';
import { Controller, UseFormRegister, UseFormWatch } from 'react-hook-form';
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
  register: UseFormRegister<CreateQuotationDto>;
  watch: UseFormWatch<CreateQuotationDto>;
  index: number;
  showDescription?: boolean;
}

export const ArticleFormItem: React.FC<ArticleFormItemProps> = ({
  className,
  taxes,
  currencySymbol,
  register,
  watch,
  index,
  showDescription = false
}) => {
  const quantity = +(watch(`articles.${index}.quantity`) || 0);
  const unit_price = +(watch(`articles.${index}.unit_price`) || 0);
  const discount = +(watch(`articles.${index}.discount`) || 0);
  const subTotal = (quantity * unit_price).toFixed(3);

  return (
    <div className={cn(className, 'flex flex-row w-full gap-3 items-center')}>
      <div className="w-3/12">
        <Input
          className="mt-2"
          placeholder="Title"
          //@ts-ignore
          {...register(`articles.${index}.article.title`)}
        />
        {showDescription && (
          <Input
            className="mt-2"
            placeholder="Description"
            //@ts-ignore
            {...register(`articles.${index}.article.description`)}
          />
        )}
      </div>
      <div className="w-2/12">
        <Input
          className="mt-2"
          placeholder="0"
          //@ts-ignore
          {...register(`articles.${index}.quantity`)}
        />
      </div>
      <div className="w-3/12 ">
        <div className="flex items-center mt-2 gap-2">
          <Input
            className=""
            placeholder="0"
            //@ts-ignore
            {...register(`articles.${index}.unit_price`)}
          />
          <span className="mx-2">{currencySymbol}</span>
        </div>

        <div className="mt-2">
          <Label className="font-thin mx-1">Remise</Label>
          <Input
            className="mt-2"
            placeholder="0"
            //@ts-ignore
            {...register(`articles.${index}.discount`)}
          />
        </div>
      </div>
      <div className="w-2/12">
        <Select onValueChange={() => {}} value={undefined}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="0%" />
          </SelectTrigger>
          <SelectContent>
            {taxes?.map((tax: Tax) => {
              return (
                <SelectItem key={tax.id} value={tax?.rate?.toString() || ''}>
                  {tax?.label}%
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {/* <Controller
          control={control}
          name={`tax`}
          // defaultValue={+(watch() || 0)}
          render={({ field }) => {
            return (
              
            );
          }}
        /> */}
        <Button className="mt-2 w-full">Ajouter</Button>
      </div>
      <div className="w-2/12 text-center">
        <Label>
          {subTotal} {currencySymbol}
        </Label>
      </div>
    </div>
  );
};
