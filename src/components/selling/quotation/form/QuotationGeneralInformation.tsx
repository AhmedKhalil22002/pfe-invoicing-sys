import { Firm, Interlocutor } from '@/api';
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
import { CalendarDatePicker } from '@/components/ui/calendar-day-picker';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { PlusCircle, PlusSquare } from 'lucide-react';

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
  const router = useRouter();
  const quotationManager = useQuotationManager();

  const object = quotationManager.object || '';
  const firmId = quotationManager.firm?.id?.toString() || defaultFirmId;

  // handle the firm changes
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
          <CalendarDatePicker
            date={
              quotationManager?.date
                ? { from: new Date(quotationManager?.date) }
                : { from: new Date() }
            }
            onDateSelect={({ from, to }) => {
              quotationManager.set('date', from);
            }}
            variant="outline"
            numberOfMonths={1}
            className="w-full mt-2"
            isPending={loading}
          />
        </div>
        <div className="w-full">
          <Label>Échéance (*)</Label>
          <CalendarDatePicker
            date={
              quotationManager?.dueDate
                ? { from: new Date(quotationManager?.dueDate) }
                : { from: new Date() }
            }
            onDateSelect={({ from, to }) => {
              quotationManager.set('dueDate', from);
            }}
            variant="outline"
            numberOfMonths={1}
            className="w-full mt-2"
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
            dateFormat={quotationManager.sequentialNumber?.dynamicSequence}
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
            {/* Shortcut to access firm form */}
            <Label
              className="mx-1 hover:underline"
              onClick={() => router.push('/contacts/new-firm')}>
              Vous ne trouvez pas ce que vous cherchez ? Ajoutez une entreprise ici.
            </Label>
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
