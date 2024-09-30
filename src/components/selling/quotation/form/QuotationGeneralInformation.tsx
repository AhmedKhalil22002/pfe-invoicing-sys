import { Firm, Interlocutor } from '@/types';
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
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

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
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');

  const router = useRouter();
  const quotationManager = useQuotationManager();

  const firmId = quotationManager.firm?.id?.toString() || defaultFirmId;

  // handle the firm changes
  React.useEffect(() => {
    if (firmId) {
      const firm = firms.find((f) => f.id === parseInt(firmId));
      quotationManager.set('firm', firm);
    }
  }, [defaultFirmId]);

  return (
    <div className={cn(className)}>
      <div className="flex gap-4 pb-5 border-b">
        <div className="w-full">
          <Label>{tInvoicing('quotation.attributes.date')} (*)</Label>
          <CalendarDatePicker
            label={tCommon('pick_date')}
            date={
              quotationManager?.date
                ? { from: quotationManager?.date, to: undefined }
                : { from: undefined, to: undefined }
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
          <Label>{tInvoicing('quotation.attributes.due_date')} (*)</Label>
          <CalendarDatePicker
            label={tCommon('pick_date')}
            date={
              quotationManager?.dueDate
                ? { from: quotationManager?.dueDate, to: undefined }
                : { from: undefined, to: undefined }
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
          <Label>{tInvoicing('quotation.attributes.object')} (*)</Label>
          <Input
            className="mt-1"
            placeholder="Ex. Devis pour le 1er trimestre 2024"
            value={quotationManager.object || ''}
            onChange={(e) => {
              quotationManager.set('object', e.target.value);
            }}
            isPending={loading}
          />
        </div>
        <div className="w-2/6">
          <Label>{tInvoicing('quotation.singular')} N°</Label>
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
          <div className="flex flex-col gap-4 w-1/2">
            <div>
              <Label>{tInvoicing('quotation.attributes.firm')} (*)</Label>
              <SelectShimmer isPending={loading}>
                <Select
                  onValueChange={(e) => {
                    const firm = firms?.find((firm) => firm.id === parseInt(e));
                    quotationManager.setFirm(firm);
                    quotationManager.set('currency', firm?.currency);
                  }}
                  value={firmId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={tInvoicing('quotation.associate_firm')} />
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

            {/* Shortcut to access firm form */}
            <Label
              className="mx-1 hover:underline cursor-pointer"
              onClick={() => router.push('/contacts/new-firm')}>
              {tInvoicing('common.firm_not_there')}
            </Label>
          </div>
          <div className="w-1/2">
            <Label>{tInvoicing('quotation.attributes.interlocutor')} (*)</Label>
            <SelectShimmer isPending={loading}>
              <Select
                disabled={!quotationManager?.firm?.id && !defaultFirmId}
                onValueChange={(e) => {
                  quotationManager.setInterlocutor({ id: parseInt(e) } as Interlocutor);
                }}
                value={quotationManager.interlocutor?.id?.toString() || ''}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={tInvoicing('quotation.associate_interlocutor')} />
                </SelectTrigger>
                <SelectContent>
                  {quotationManager.firm?.interlocutorsToFirm?.map((entry: any) => (
                    <SelectItem
                      key={entry.interlocutor?.id || 'interlocutor'}
                      value={entry.interlocutor?.id?.toString()}
                      className="mx-1">
                      {entry.interlocutor?.name} {entry.interlocutor?.surname}{' '}
                      {entry.isMain && (
                        <span className="font-bold">({tCommon('words.main_m')})</span>
                      )}
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
                  addressType={tInvoicing('quotation.attributes.invoicing_address')}
                  address={quotationManager.firm?.invoicingAddress}
                  loading={loading}
                />
              </div>
            )}
            {!isDeliveryAddressHidden && (
              <div className="w-1/2">
                <AddressDetails
                  addressType={tInvoicing('quotation.attributes.delivery_address')}
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
