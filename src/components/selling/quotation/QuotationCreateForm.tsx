import { CreateQuotationDto, Firm, Quotation } from '@/api';
import { BreadcrumbCommon, Spinner } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
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
import useCabinet from '@/hooks/useCabinet';
import useFirmChoice from '@/hooks/useFirmChoice';
import { cn } from '@/lib/utils';

import { useRouter } from 'next/router';
import React from 'react';
import { QuotationAddressDetails } from './QuotationAddressDetails';
import { Controller, Form, useForm } from 'react-hook-form';
interface QuotationFormProps {
  className?: string;
}

export const QuotationCreateForm = ({ className }: QuotationFormProps) => {
  const router = useRouter();
  const { firms, isFetchFirmsPending } = useFirmChoice({id: true,mainInterlocutor: true});
  const [showDeliveryAddress, setShowDeliveryAddress] = React.useState(false);
  const { register, control, handleSubmit, watch, reset, setValue } = useForm<CreateQuotationDto>();

  const loading = isFetchFirmsPending;
  if (loading) return <Spinner className="h-screen" show={loading} />;
  return (
    <div className={cn('overflow-auto p-8', className)}>
      <BreadcrumbCommon
        hierarchy={[
          { title: 'Vente', href: '/selling' },
          { title: 'Devis', href: '/selling/quotations' },
          { title: 'Nouveau Devis' }
        ]}
      />
      <Form control={control}>
        <div className="block lg:flex gap-4">
          <div className="w-full lg:w-9/12">
            <Card className="w-full">
              <CardContent className="p-5">
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
                      <Label>Client</Label>
                      <Controller
                        control={control}
                        name={`firmId`}
                        defaultValue={+(watch('firmId') || 0)}
                        render={({ field }) => (
                          <Select
                            onValueChange={(e) => {
                              field.onChange(e);
                            }}
                            value={field.value ? field.value.toString() : ''}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Firme" />
                            </SelectTrigger>
                            <SelectContent className="p-2">
                              {firms?.map((firm: Partial<Firm>) => {
                                return (
                                  <React.Fragment key={firm.id}>
                                    <span className="mx-3 my-3 font-bold cursor-pointer">
                                      {firm.name}
                                    </span>{' '}
                                    {
                                      <SelectItem
                                        value={firm?.mainInterlocutor?.id?.toString() || ''}
                                        className="my-1">
                                        {firm?.mainInterlocutor?.title}{' '}
                                        {firm?.mainInterlocutor?.name}{' '}
                                        {firm?.mainInterlocutor?.surname}
                                      </SelectItem>
                                    }
                                  </React.Fragment>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 pb-5 border-b mt-5">
                    <div className="w-1/2">
                      <QuotationAddressDetails
                        addressType="Adresse de Facturation"
                        address={watch('firm.invoicingAddress')}
                      />
                    </div>
                    <div className="w-1/2">
                      <QuotationAddressDetails
                        addressType="Adresse de Livraison"
                        address={watch('firm.deliveryAddress')}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full mt-5 lg:mt-0 lg:w-3/12">
            <Card className="w-full">
              <CardContent className="p-5"></CardContent>
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
};
