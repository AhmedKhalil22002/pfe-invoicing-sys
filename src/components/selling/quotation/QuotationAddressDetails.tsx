import React from 'react';
import { Address } from '@/api';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface QuotationAddressDetailsProps {
  className?: string;
  addressType?: string;
  address?: Address;
}

export const QuotationAddressDetails: React.FC<QuotationAddressDetailsProps> = ({
  className,
  addressType,
  address
}) => {
  return (
    <div className={cn(className)}>
      <Label>{addressType}</Label>
      <div className="flex flex-col gap-1 mt-2">
        <Label>
          Address: <span className="font-thin">{address?.address}</span>
        </Label>
        {address?.address2 ? (
          <Label>
            Address 2 : <span className="font-thin">{address?.address2}</span>
          </Label>
        ) : null}
        <Label>
          Code Postal : <span className="font-thin">{address?.zipcode}</span>
        </Label>
        <Label>
          Region : <span className="font-thin">{address?.region}</span>
        </Label>
        <Label>
          Pays : <span className="font-thin">{address?.country?.name}</span>
        </Label>
      </div>
    </div>
  );
};
