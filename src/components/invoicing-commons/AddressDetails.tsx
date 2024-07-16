import React from 'react';
import { Address } from '@/api';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Skeleton } from '../ui/skeleton';

interface AddressDetailsProps {
  className?: string;
  addressType?: string;
  address?: Address;
  loading?: boolean;
}

export const AddressDetails: React.FC<AddressDetailsProps> = ({
  className,
  addressType,
  address,
  loading
}) => {
  if (!address) return null;
  return (
    <div className={cn(className)}>
      {loading ? (
        <Skeleton className="h-24 mr-2" />
      ) : (
        <>
          <Label>{addressType}</Label>
          <div className="flex flex-col gap-1 mt-2">
            {address?.address && (
              <Label>
                Address: <span className="font-light">{address?.address}</span>
              </Label>
            )}
            {address?.address2 && (
              <Label>
                Address 2 : <span className="font-light">{address?.address2}</span>
              </Label>
            )}
            {address?.zipcode && (
              <Label>
                Code Postal : <span className="font-light">{address?.zipcode}</span>
              </Label>
            )}
            {address?.region && (
              <Label>
                Region : <span className="font-light">{address?.region}</span>
              </Label>
            )}
            {address?.country && (
              <Label>
                Pays : <span className="font-light">{address?.country?.name}</span>
              </Label>
            )}
          </div>
        </>
      )}
    </div>
  );
};
