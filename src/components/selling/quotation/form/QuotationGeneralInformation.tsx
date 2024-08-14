import { Firm, Interlocutor, SequentialNumber } from '@/api';
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
import { AddressDetails } from '../../../invoicing-commons/AddressDetails';
import { cn } from '@/lib/utils';
import { useQuotationManager } from '@/components/selling/quotation/hooks/useQuotationManager';
import { SequenceInput } from '@/components/invoicing-commons/SequenceInput';

interface QuotationGeneralInformationProps {
  className?: string;
  firms: Firm[];
  defaultFirmId?: string;
  isInvoicingAddressHidden?: boolean;
  isDeliveryAddressHidden?: boolean;
  loading?: boolean;
}

export const QuotationGeneralInformation = ({
  className,
  firms,
  defaultFirmId = undefined,
  isInvoicingAddressHidden,
  isDeliveryAddressHidden,
  loading
}: QuotationGeneralInformationProps) => {
  const quotationManager = useQuotationManager();

  const date = quotationManager.date || null;
  const dueDate = quotationManager.dueDate || null;
  const object = quotationManager.object || '';
  const firmId = quotationManager.firm?.id?.toString() || defaultFirmId;
  React.useEffect(() => {
    if (firmId) {
      const firm = firms.find((f) => f.id === +firmId);
      quotationManager.set('firm', firm);
    }
  }, [defaultFirmId]);
  const interlocutorId = quotationManager.interlocutor?.id?.toString() || '';

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
            date={date || undefined}
            isPending={loading}
          />
        </div>
        <div className="w-full">
          <Label>Échéance (*)</Label>
          <DatePicker
            className="mt-2"
            setDate={(date) => {
              quotationManager.set('dueDate', date);
            }}
            date={dueDate || undefined}
            isPending={loading}
          />
        </div>
      </div>

      <div className="flex gap-4 pb-5 border-b mt-5">
        <div className="w-4/6">
          <Label>Objet (*)</Label>
          <Input
            className="mt-1"
            placeholder="Ex. Devis pour le 1er trimestre 2024"
            value={object}
            onChange={(e) => {
              quotationManager.set('object', e.target.value);
            }}
            isPending={loading}
          />
        </div>
        <div className="w-2/6">
          <Label>Devis N°</Label>
          <SequenceInput
            prefix={quotationManager.sequentialNumber?.prefix}
            dateFormat={quotationManager.sequentialNumber?.dynamic_sequence}
            value={quotationManager.sequentialNumber?.next}
            loading={loading}
          />
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
                value={firmId}>
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
                disabled={!quotationManager?.firm?.id && !defaultFirmId}
                onValueChange={(e) => {
                  quotationManager.setInterlocutor({ id: +e } as Interlocutor);
                }}
                value={interlocutorId}>
                <SelectTrigger className="mt-1">
                  {!quotationManager.isInterlocutorInFirm ? (
                    <span className="text-slate-500">Choisissez un interlocuteur</span>
                  ) : (
                    <SelectValue />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {quotationManager.firm?.interlocutorsToFirm?.map((entry: any) => (
                    <SelectItem
                      key={entry.interlocutor?.id || 'interlocutor'}
                      value={entry.interlocutor?.id?.toString()}
                      className="mx-1">
                      {entry.interlocutor?.name} {entry.interlocutor?.surname}{' '}
                      {entry.isMain && <span className="font-bold">(Principale)</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SelectShimmer>
          </div>
        </div>
        {!(
          (isInvoicingAddressHidden && isDeliveryAddressHidden) ||
          quotationManager.firm?.id == undefined
        ) && (
          <div className="flex gap-4 pb-5 border-b mt-5">
            {!isInvoicingAddressHidden && (
              <div className="w-1/2">
                <AddressDetails
                  addressType="Adresse de Facturation"
                  address={quotationManager.firm?.invoicingAddress}
                  loading={loading}
                />
              </div>
            )}
            {!isDeliveryAddressHidden && (
              <div className="w-1/2">
                <AddressDetails
                  addressType="Adresse de Livraison"
                  address={quotationManager.firm?.deliveryAddress}
                  loading={loading}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
