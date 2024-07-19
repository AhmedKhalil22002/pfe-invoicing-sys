import { CreateQuotationDto, Firm, Quotation } from '@/api';
import { DatePicker } from '@/components/ui/date-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import React from 'react';
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form';
import { AddressDetails } from '@/components/invoicing-commons/AddressDetails';
import { cn } from '@/lib/utils';
import { transformDate } from '@/utils/date.utils';

interface QuotationGeneralInformationDetailsProps {
  className?: string;
  quotation?: Quotation;
  register: UseFormRegister<CreateQuotationDto>;
  control: Control<CreateQuotationDto, any>;
  watch: UseFormWatch<CreateQuotationDto>;
  setValue: UseFormSetValue<CreateQuotationDto>;
  firms: Firm[];
  handleFirmChange: (firm: Firm) => void;
  isInvoicingAddressHidden?: boolean;
  isDeliveryAddressHidden?: boolean;
  loading?: boolean;
}

export const QuotationGeneralInformationDetails = ({
  className,
  quotation,
  register,
  control,
  watch,
  setValue,
  firms,
  handleFirmChange,
  isInvoicingAddressHidden,
  isDeliveryAddressHidden
}: QuotationGeneralInformationDetailsProps) => {
  const [selectedFirm, setSelectedFirm] = React.useState<Firm | null>(null);

  React.useEffect(() => {
    if (selectedFirm) {
      setValue('interlocutorId', 0);
    }
  }, [selectedFirm, setValue]);

  return (
    <div className={cn(className)}>
      <div className="flex gap-4 pb-5 border-b">
        <div className="w-full">
          <Label className="my-4">
            Date : {quotation?.date ? transformDate(quotation?.date) : undefined}
          </Label>
        </div>
        <div className="w-full">
          {/* <Label>Échéance (*)</Label>
          <Controller
            control={control}
            name="dueDate"
            render={({ field }) => (
              <DatePicker
                className="mt-2"
                setDate={(date) => {
                  field.onChange(date);
                }}
                date={field.value ? new Date(field.value) : undefined}
              />
            )}
          /> */}
        </div>
      </div>

      <div className="flex gap-4 pb-5 border-b mt-5">
        <div className="w-4/6">
          <Label>Objet (*)</Label>
          {/* <Input
            className="mt-1"
            placeholder="Ex. Devis pour le 1er trimestre 2024"
            {...register('object')}
          /> */}
        </div>
        <div className="w-2/6">
          <Label>Devis N°</Label>
          {/* <Input disabled className="mt-1" placeholder="Ex. QUO-2024-06-1" /> */}
        </div>
      </div>
      <div>
        <div className="flex gap-4 pb-5 border-b mt-5">
          <div className="w-1/2 pr-2">
            <Label>Entreprise (*)</Label>
            {/* <Controller
              control={control}
              name="firmId"
              render={({ field }) => (
                <Select
                  onValueChange={(e) => {
                    const firm = firms?.find((firm) => firm.id === +e);
                    if (firm) {
                      handleFirmChange(firm);
                      setSelectedFirm(firm);
                    }
                    field.onChange(+e);
                  }}
                  value={field.value ? field.value.toString() : undefined}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choisissez une Entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    {firms?.map((firm: Partial<Firm>) => (
                      <SelectItem key={firm.id} value={firm.id?.toString() || ''} className="mx-1">
                        {firm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            /> */}
          </div>
          <div className="w-1/2 pr-2">
            <Label>Interlocuteur (*)</Label>
            {/* <Controller
              control={control}
              name="interlocutorId"
              render={({ field }) => (
                <Select
                  disabled={watch('firmId') == 0}
                  onValueChange={(e) => {
                    field.onChange(+e);
                  }}
                  value={(field.value && field.value.toString()) || ''}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choisissez un interlocuteur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={selectedFirm?.mainInterlocutor?.id?.toString() || '-1'}
                      className="mx-1">
                      {selectedFirm?.mainInterlocutor?.name}{' '}
                      {selectedFirm?.mainInterlocutor?.surname}{' '}
                      <span className="font-bold">(Principale)</span>
                    </SelectItem>
                    {selectedFirm?.interlocutors?.map((interlocutor: any) => (
                      <SelectItem
                        key={interlocutor.id}
                        value={interlocutor.id?.toString() || ''}
                        className="mx-1">
                        {interlocutor.name} {interlocutor.surname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            /> */}
          </div>
        </div>
        {/* {!((isInvoicingAddressHidden && isDeliveryAddressHidden) || watch('firmId') == 0) && (
          <div className="flex gap-4 pb-5 border-b mt-5">
            {!isInvoicingAddressHidden && (
              <div className="w-1/2">
                <AddressDetails
                  addressType="Adresse de Facturation"
                  address={watch('firm.invoicingAddress')}
                />
              </div>
            )}
            {!isDeliveryAddressHidden && (
              <div className="w-1/2">
                <AddressDetails
                  addressType="Adresse de Livraison"
                  address={watch('firm.deliveryAddress')}
                />
              </div>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
};
