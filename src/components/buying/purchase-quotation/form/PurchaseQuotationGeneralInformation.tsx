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
import { usePurchaseQuotationManager } from '@/components/buying/purchase-quotation/hooks/usePurchaseQuotationManager';
import { SequenceInput } from '@/components/invoicing-commons/SequenceInput';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { UneditableCalendarDayPicker } from '@/components/ui/uneditable/uneditable-calendar-day-picker';

import { DatePicker } from '@/components/ui/date-picker';

interface PurchaseQuotationGeneralInformationProps {
  className?: string;
  firms: Firm[];
  isInvoicingAddressHidden?: boolean;
  isDeliveryAddressHidden?: boolean;
  loading?: boolean;
  edit?: boolean;
}

export const PurchaseQuotationGeneralInformation = ({
  className,
  firms,
  isInvoicingAddressHidden,
  isDeliveryAddressHidden,
  edit = true,
  loading
}: PurchaseQuotationGeneralInformationProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const router = useRouter();
  const purchaseQuotationManager = usePurchaseQuotationManager();
  const mainInterlocutor = purchaseQuotationManager.firm?.interlocutorsToFirm?.find(
    (entry) => entry?.isMain
  );

  return (
    <div className={cn(className)}>
      <div className="flex gap-4 pb-5 border-b">
        {/* Date */}
        <div className="w-full">
          <Label>{tInvoicing('purchase-quotation.attributes.date')} (*)</Label>

          {edit ? (
            <DatePicker
              className="w-full mt-2"
              value={purchaseQuotationManager?.date || new Date()}
              onChange={(value: Date) => {
                purchaseQuotationManager.set('date', value);
              }}
              isPending={loading}
            />
          ) : (
            <UneditableCalendarDayPicker value={purchaseQuotationManager?.date} />
          )}
        </div>
        {/* Due Date */}
        <div className="w-full">
          <Label>{tInvoicing('purchase-quotation.attributes.due_date')} (*)</Label>
          {edit ? (
            <DatePicker
              className="w-full mt-2"
              value={purchaseQuotationManager?.dueDate || new Date()}
              onChange={(value: Date) => {
                purchaseQuotationManager.set('dueDate', value);
              }}
              isPending={loading}
            />
          ) : (
            <UneditableCalendarDayPicker value={purchaseQuotationManager?.dueDate} />
          )}
        </div>
      </div>
      {/* Object */}
      <div className="flex gap-4 pb-5 border-b mt-5">
        <div className="w-4/6">
          <Label>{tInvoicing('purchase-quotation.attributes.object')} (*)</Label>
          {edit ? (
            <Input
              className="mt-1"
              placeholder="Ex. Devis pour le 1er trimestre 2024"
              value={purchaseQuotationManager.object || ''}
              onChange={(e) => {
                purchaseQuotationManager.set('object', e.target.value);
              }}
              
            />
          ) : (
            <Input value={purchaseQuotationManager.object} disabled />
          )}
        </div>
        {/* Sequential */}
        <div className="w-2/6">
          <Label>{tInvoicing('purchase-quotation.singular')} N°</Label>
          <SequenceInput
            prefix={purchaseQuotationManager.sequentialNumber?.prefix}
            dateFormat={purchaseQuotationManager.sequentialNumber?.dateFormat}
            value={purchaseQuotationManager.sequentialNumber?.next}
           />

        </div>
      </div>
      <div>
        <div className="flex gap-4 pb-5 border-b mt-5">
          {/* Firm */}
          <div className="flex flex-col gap-4 w-1/2">
            <div>
              <Label>{tInvoicing('purchase-quotation.attributes.firm')} (*)</Label>
              {edit ? (
                <SelectShimmer isPending={loading}>
                  <Select
                    onValueChange={(e) => {
                      const firm = firms?.find((firm) => firm.id === parseInt(e));
                      purchaseQuotationManager.setFirm(firm);
                      purchaseQuotationManager.set('currency', firm?.currency);
                    }}
                    value={purchaseQuotationManager.firm?.id?.toString()}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={tInvoicing('purchase-quotation.associate_firm')} />
                    </SelectTrigger>
                    <SelectContent>
                      {firms?.map((firm: Partial<Firm>) => (
                        <SelectItem
                          key={firm.id}
                          value={firm.id?.toString() || ''}
                          className="mx-1">
                          {firm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </SelectShimmer>
              ) : (
                <Input value={purchaseQuotationManager?.firm?.name} />
              )}
            </div>

            {/* Shortcut to access firm form */}
            {edit && (
              <Label
                className="mx-1 underline cursor-pointer"
                onClick={() => router.push('/contacts/new-firm')}>
                {tInvoicing('common.firm_not_there')}
              </Label>
            )}
          </div>
          <div className="w-1/2">
            <Label>{tInvoicing('purchase-quotation.attributes.interlocutor')} (*)</Label>
            {edit ? (
              <SelectShimmer isPending={loading}>
                <Select
                  disabled={!purchaseQuotationManager?.firm?.id}
                  onValueChange={(e) => {
                    purchaseQuotationManager.setInterlocutor({ id: parseInt(e) } as Interlocutor);
                  }}
                  value={purchaseQuotationManager.interlocutor?.id?.toString()}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={tInvoicing('purchase-quotation.associate_interlocutor')} />
                  </SelectTrigger>
                  <SelectContent>
                    {purchaseQuotationManager.firm?.interlocutorsToFirm?.map((entry: any) => (
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
            ) : null}
          </div>
        </div>
        {!(
          (isInvoicingAddressHidden && isDeliveryAddressHidden) ||
          purchaseQuotationManager.firm?.id == undefined
        ) && (
          <div className="flex gap-4 pb-5 border-b mt-5">
            {!isInvoicingAddressHidden && (
              <div className="w-1/2">
                <AddressDetails
                  addressType={tInvoicing('purchase-quotation.attributes.invoicing_address')}
                  address={purchaseQuotationManager.firm?.invoicingAddress}
                  loading={loading}
                />
              </div>
            )}
            {!isDeliveryAddressHidden && (
              <div className="w-1/2">
                <AddressDetails
                  addressType={tInvoicing('purchase-quotation.attributes.delivery_address')}
                  address={purchaseQuotationManager.firm?.deliveryAddress}
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
