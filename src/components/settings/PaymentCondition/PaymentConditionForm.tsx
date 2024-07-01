import React from 'react';
import { PaymentCondition } from '@/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PaymentConditionFormProps {
  className?: string;
  paymentCondition: PaymentCondition | null;
  onPaymentConditionChange: (paymentCondition: PaymentCondition) => void;
}

export const PaymentConditionForm = ({
  className,
  paymentCondition,
  onPaymentConditionChange
}: PaymentConditionFormProps) => {
  return (
    <div className={className}>
      <div className="mt-4">
        <Label>Titre(*)</Label>
        <Input
          className="mt-2"
          placeholder="Ex. Envoyer des rappels"
          name="label"
          value={paymentCondition?.label}
          onChange={(e) => {
            paymentCondition &&
              onPaymentConditionChange({
                ...paymentCondition,
                [e.target.name]: e.target.value || ''
              });
          }}
        />
      </div>
      <div className="mt-4">
        <Label>Description(*)</Label>
        <Textarea
          className="mt-2 resize-none"
          name="description"
          value={paymentCondition?.description}
          onChange={(e) => {
            paymentCondition &&
              onPaymentConditionChange({
                ...paymentCondition,
                [e.target.name]: e.target.value || ''
              });
          }}
        />
      </div>
    </div>
  );
};
