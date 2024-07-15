import { CreateQuotationDto, Firm, Interlocutor, quotation } from '@/api';
import { DatePicker } from '@/components/ui/date-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectShimmer,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import React from 'react';
import { useWatch } from 'react-hook-form';
import { AddressDetails } from '../../../invoicing-commons/AddressDetails';
import { cn } from '@/lib/utils';
import { useInvoicingManager } from '@/hooks/functions/useInvoicingInformations';

interface QuotationGeneralInformationsProps {
  className?: string;
  firms: Firm[];
  isInvoicingAddressHidden?: boolean;
  isDeliveryAddressHidden?: boolean;
  loading?: boolean;
}

export const QuotationGeneralInformations = ({
  className,
  firms,
  isInvoicingAddressHidden,
  isDeliveryAddressHidden,
  loading
}: QuotationGeneralInformationsProps) => {
  const quotationManager = useInvoicingManager();
  return (
    <div className={cn(className)}>
      <div className="flex gap-4 pb-5 border-b">
        <div className="w-full">
          <Label>Date (*)</Label>
          <DatePicker
            className="mt-2"
            setDate={(date) => {
              quotationManager.set('date', date);
            }}
            date={quotationManager.date ? quotationManager.date : undefined}
          />
        </div>
        <div className="w-full">
          <Label>Échéance (*)</Label>
          <DatePicker
            className="mt-2"
            setDate={(date) => {
              quotationManager.set('dueDate', date);
            }}
            date={quotationManager.dueDate ? quotationManager.dueDate : undefined}
          />
        </div>
      </div>

      <div className="flex gap-4 pb-5 border-b mt-5">
        <div className="w-4/6">
          <Label>Objet (*)</Label>
          <Input
            className="mt-1"
            placeholder="Ex. Devis pour le 1er trimestre 2024"
            value={quotationManager.object}
            onChange={(e) => {
              quotationManager.set('object', e.target.value);
            }}
          />
        </div>
        <div className="w-2/6">
          <Label>Devis N°</Label>
          <Input disabled className="mt-1" placeholder="Ex. QUO-2024-06-1" />
        </div>
      </div>
      <div>
        <div className="flex gap-4 pb-5 border-b mt-5">
          <div className="w-1/2 pr-2">
            <Label>Entreprise (*)</Label>
            <SelectShimmer isPending={loading}>
              <Select
                onValueChange={(e) => {
                  const firm = firms?.find((firm) => firm.id === +e);
                  quotationManager.setFirm(firm);
                }}
                value={quotationManager.firm?.id?.toString() || undefined}>
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
            </SelectShimmer>
          </div>
          <div className="w-1/2 pr-2">
            <Label>Interlocuteur (*)</Label>
            <SelectShimmer isPending={loading}>
              <Select
                disabled={!quotationManager.firm}
                onValueChange={(e) => {
                  quotationManager.setInterlocutor({ id: +e } as Interlocutor);
                }}
                value={quotationManager?.interlocutor?.id?.toString() || undefined}>
                <SelectTrigger className="mt-1">
                  {!quotationManager.isInterlocutorInFirm ? (
                    <span className="text-slate-500">Choisissez un interlocuteur</span>
                  ) : (
                    <SelectValue />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {quotationManager.firm?.mainInterlocutor?.id && (
                    <SelectItem
                      value={quotationManager.firm?.mainInterlocutor?.id?.toString()}
                      className="mx-1">
                      {quotationManager.firm?.mainInterlocutor?.name}{' '}
                      {quotationManager.firm?.mainInterlocutor?.surname}{' '}
                      <span className="font-bold">(Principale)</span>
                    </SelectItem>
                  )}
                  {quotationManager.firm?.interlocutors?.map((interlocutor: any) => (
                    <SelectItem
                      key={interlocutor.id}
                      value={interlocutor.id?.toString() || ''}
                      className="mx-1">
                      {interlocutor.name} {interlocutor.surname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SelectShimmer>
          </div>
        </div>
        {!(
          (isInvoicingAddressHidden && isDeliveryAddressHidden) ||
          quotationManager.firm?.id == 0
        ) && (
          <div className="flex gap-4 pb-5 border-b mt-5">
            {!isInvoicingAddressHidden && (
              <div className="w-1/2">
                <AddressDetails
                  addressType="Adresse de Facturation"
                  address={quotationManager.firm?.invoicingAddress}
                />
              </div>
            )}
            {!isDeliveryAddressHidden && (
              <div className="w-1/2">
                <AddressDetails
                  addressType="Adresse de Livraison"
                  address={quotationManager.firm?.deliveryAddress}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
