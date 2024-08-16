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
    toast.info('Those Addresses are the same already', { position: 'bottom-right' });
  } else {
    if (prefix === t('firm.attributes.delivery_address')) {
      if (_.isEqual(emptyAddress, daManager.address))
        toast.info('This Address is Empty', { position: 'bottom-right' });
      iaManager.setEntireAddress(daManager.address);
    } else {
      if (_.isEqual(emptyAddress, iaManager.address))
        toast.info('This Address is Empty', { position: 'bottom-right' });
      daManager.setEntireAddress(iaManager.address);
    }
  }
};
