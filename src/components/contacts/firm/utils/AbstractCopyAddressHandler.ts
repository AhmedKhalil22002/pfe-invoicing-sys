import { api } from '@/api';
import { Address, AddressType } from '@/types';
import _ from 'lodash';
import { toast } from 'react-toastify';

export const AbstractCopyAddressHandler = (
  t: Function,
  prefix: AddressType,
  invoicingAddress?: Address,
  setInvoicingAddress?: (address: Address) => void,
  deliveryAddress?: Address,
  setDeliveryAddress?: (address: Address) => void
) => {
  const emptyAddress = api.address.factory();
  if (_.isEqual(invoicingAddress, deliveryAddress)) {
    toast.info('Those Addresses are the same already');
  } else {
    if (prefix === t('firm.attributes.delivery_address')) {
      if (_.isEqual(emptyAddress, deliveryAddress)) toast.info('This Address is Empty');
      deliveryAddress && setInvoicingAddress?.(deliveryAddress);
    } else {
      if (_.isEqual(emptyAddress, invoicingAddress)) toast.info('This Address is Empty');
      invoicingAddress && setDeliveryAddress?.(invoicingAddress);
    }
  }
};
