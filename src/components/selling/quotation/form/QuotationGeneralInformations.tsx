import { CreateQuotationDto, Firm } from '@/api';
import { DatePicker } from '@/components/ui/date-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import React from 'react';
import { Control, Controller, UseFormRegister, UseFormWatch } from 'react-hook-form';
import { QuotationAddressDetails } from './QuotationAddressDetails';
import { cn } from '@/lib/utils';

interface QuotationGeneralInformationsProps {
  className?: string;
  register: UseFormRegister<CreateQuotationDto>;
  control: Control<CreateQuotationDto, any>;
  watch: UseFormWatch<CreateQuotationDto>;
  firms: Firm[];
  handleFirmChange: (firm: Firm) => void;
  isInvoicingAddressHidden?: boolean;
  isDeliveryAddressHidden?: boolean;
  loading?: boolean;
}

export const QuotationGeneralInformations = ({
  className,
  control,
  watch,
  firms,
  handleFirmChange,
  isInvoicingAddressHidden,
  isDeliveryAddressHidden
}: QuotationGeneralInformationsProps) => {
  return (
    <div className={cn(className)}>
      <div className="flex gap-4 pb-5 border-b">
        <div className="w-full ">
          <Label>Date</Label>
          <DatePicker className="mt-2" date={new Date()} />
        </div>
        <div className="w-full">
          <Label>Date</Label>
          <DatePicker className="mt-2" date={new Date()} />
        </div>
      </div>

      <div className="flex gap-4 pb-5 border-b mt-5">
        <div className="w-4/6">
          <Label>Objet</Label>
          <Input className="mt-1" placeholder="Ex. Devis pour le 1er trimestre 2024" />
        </div>
        <div className="w-2/6">
          <Label>Devis N°</Label>
          <Input disabled className="mt-1" placeholder="Ex. QUO-2024-06-1" />
        </div>
      </div>
      <div>
        <div className="flex gap-4 pb-5 border-b mt-5">
          <div className="w-4/6 pr-2">
            <Label>Entreprise</Label>
            <Controller
              control={control}
              name={`firmId`}
              defaultValue={+(watch('firmId') || 0)}
              render={({ field }) => {
                return (
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e);
                      const selectedFirm = firms?.find((firm) => firm.mainInterlocutorId === +e);
                      if (selectedFirm) handleFirmChange(selectedFirm);
                    }}
                    defaultValue={(field.value && field.value.toString()) || ''}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choisissez une Entreprise" />
                    </SelectTrigger>
                    <SelectContent className="p-2">
                      {firms?.map((firm: Partial<Firm>) => {
                        return (
                          <React.Fragment key={firm.id}>
                            <SelectGroup>
                              <SelectLabel>{firm.name}</SelectLabel>
                              {
                                <SelectItem
                                  value={firm?.mainInterlocutor?.id?.toString() || ''}
                                  className="mx-1">
                                  {firm?.mainInterlocutor?.title} {firm?.mainInterlocutor?.name}{' '}
                                  {firm?.mainInterlocutor?.surname}
                                </SelectItem>
                              }
                            </SelectGroup>
                          </React.Fragment>
                        );
                      })}
                    </SelectContent>
                  </Select>
                );
              }}
            />
          </div>
        </div>
        {!((isInvoicingAddressHidden && isDeliveryAddressHidden) || watch('firmId') === 0) && (
          <div className="flex gap-4 pb-5 border-b mt-5">
            {!isInvoicingAddressHidden && (
              <div className="w-1/2">
                <QuotationAddressDetails
                  addressType="Adresse de Facturation"
                  address={watch('firm.invoicingAddress')}
                />
              </div>
            )}
            {!isDeliveryAddressHidden && (
              <div className="w-1/2">
                <QuotationAddressDetails
                  addressType="Adresse de Livraison"
                  address={watch('firm.deliveryAddress')}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
