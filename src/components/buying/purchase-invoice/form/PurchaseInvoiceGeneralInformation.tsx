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
import { SequenceInput } from '@/components/invoicing-commons/SequenceInput';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { UneditableCalendarDayPicker } from '@/components/ui/uneditable/uneditable-calendar-day-picker';

import { DatePicker } from '@/components/ui/date-picker';
import { usePurchaseInvoiceManager } from '../hooks/usePurchaseInvoiceManager';

interface PurchaseInvoiceGeneralInformationProps {
  className?: string;
  firms: Firm[];
  isInvoicingAddressHidden?: boolean;
  isDeliveryAddressHidden?: boolean;
  loading?: boolean;
  edit?: boolean;
}

export const PurchaseInvoiceGeneralInformation = ({
  className,
  firms,
  isInvoicingAddressHidden,
  isDeliveryAddressHidden,
  edit = true,
  loading
}: PurchaseInvoiceGeneralInformationProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const router = useRouter();
  const purchaseInvoiceManager = usePurchaseInvoiceManager();

  return (
    <div className={cn(className)}>
      <div className="flex gap-4 pb-5 border-b">
        {/* Date */}
        <div className="w-full">
          <Label>{tInvoicing('purchaseInvoice.attributes.date')} (*)</Label>

          {edit ? (
            <DatePicker
              className="w-full mt-2"
              value={purchaseInvoiceManager?.date || new Date()}
              onChange={(value: Date) => {
                purchaseInvoiceManager.set('date', value);
              }}
              isPending={loading}
            />
          ) : (
            <UneditableCalendarDayPicker value={purchaseInvoiceManager?.date} />
          )}
        </div>
        {/* Due Date */}
        <div className="w-full">
          <Label>{tInvoicing('purchaseInvoice.attributes.due_date')} (*)</Label>
          {edit ? (
            <DatePicker
              className="w-full mt-2"
              value={purchaseInvoiceManager?.dueDate || new Date()}
              onChange={(value: Date) => {
                purchaseInvoiceManager.set('dueDate', value);
              }}
              isPending={loading}
            />
          ) : (
            <UneditableCalendarDayPicker value={purchaseInvoiceManager?.dueDate} />
          )}
        </div>
      </div>
      {/* Object */}
      <div className="flex gap-4 pb-5 border-b mt-5">
        <div className="w-4/6">
          <Label>{tInvoicing('purchaseInvoice.attributes.object')} (*)</Label>
          {edit ? (
            <Input
              className="mt-1"
              placeholder="Ex. Facture pour le 1er trimestre 2024"
              value={purchaseInvoiceManager.object || ''}
              onChange={(e) => {
                purchaseInvoiceManager.set('object', e.target.value);
              }}
              
            />
          ) : (
            <Input value={purchaseInvoiceManager.object} disabled />
          )}
        </div>
        {/* Sequential */}
        <div className="w-2/6">
          <Label>{tInvoicing('purchaseInvoice.singular')} N°</Label>
          <SequenceInput
            prefix={purchaseInvoiceManager.sequentialNumber?.prefix}
            dateFormat={purchaseInvoiceManager.sequentialNumber?.dateFormat}
            value={purchaseInvoiceManager.sequentialNumber?.next}
           />

        </div>
      </div>
      <div>
        <div className="flex gap-4 pb-5 border-b mt-5">
          {/* Firm */}
          <div className="flex flex-col gap-4 w-1/2">
            <div>
              <Label>{tInvoicing('purchaseInvoice.attributes.firm')} (*)</Label>
              {edit ? (
                <SelectShimmer isPending={loading}>
                  <Select
                    onValueChange={(e) => {
                      const firm = firms?.find((firm) => firm.id === parseInt(e));
                      purchaseInvoiceManager.setFirm(firm);
                      purchaseInvoiceManager.set('currency', firm?.currency);
                    }}
                    value={purchaseInvoiceManager.firm?.id?.toString()}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={tInvoicing('purchaseInvoice.associate_firm')} />
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
                <Input value={purchaseInvoiceManager?.firm?.name} />
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
            <Label>{tInvoicing('purchaseInvoice.attributes.interlocutor')} (*)</Label>
            {edit ? (
              <SelectShimmer isPending={loading}>
                <Select
                  disabled={!purchaseInvoiceManager?.firm?.id}
                  onValueChange={(e) => {
                    purchaseInvoiceManager.setInterlocutor({ id: parseInt(e) } as Interlocutor);
                  }}
                  value={purchaseInvoiceManager.interlocutor?.id?.toString()}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={tInvoicing('purchaseInvoice.associate_interlocutor')} />
                  </SelectTrigger>
                  <SelectContent>
                    {purchaseInvoiceManager.firm?.interlocutorsToFirm?.map((entry: any) => (
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
          purchaseInvoiceManager.firm?.id == undefined
        ) && (
          <div className="flex gap-4 pb-5 border-b mt-5">
            {!isInvoicingAddressHidden && (
              <div className="w-1/2">
                <AddressDetails
                  addressType={tInvoicing('purchaseInvoice.attributes.invoicing_address')}
                  address={purchaseInvoiceManager.firm?.invoicingAddress}
                  loading={loading}
                />
              </div>
            )}
            {!isDeliveryAddressHidden && (
              <div className="w-1/2">
                <AddressDetails
                  addressType={tInvoicing('purchaseInvoice.attributes.delivery_address')}
                  address={purchaseInvoiceManager.firm?.deliveryAddress}
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
