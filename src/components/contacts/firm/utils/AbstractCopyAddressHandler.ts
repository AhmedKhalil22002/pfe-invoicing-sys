import { AddressType, api } from '@/api';
import _ from 'lodash';
import { toast } from 'react-toastify';

export const AbstractCopyAddressHandler = (
  prefix: AddressType,
  iaManager: any,
  daManager: any,
  t: any
) => {
  const emptyAddress = api.address.factory();
  if (_.isEqual(daManager.address, iaManager.address)) {
    toast.info('Those Addresses are the same already');
  } else {
    if (prefix === t('firm.attributes.delivery_address')) {
      if (_.isEqual(emptyAddress, daManager.address))
        toast.info('This Address is Empty');
      iaManager.setEntireAddress(daManager.address);
    } else {
      if (_.isEqual(emptyAddress, iaManager.address))
        toast.info('This Address is Empty');
      daManager.setEntireAddress(iaManager.address);
    }
  }
};
