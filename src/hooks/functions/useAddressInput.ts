import { useState, useCallback, useMemo } from 'react';
import { Address } from '@/api/types/address';

const useAddressInput = (initialAddress: Address) => {
  const [address, setAddress] = useState<Address | undefined>(initialAddress);

  const handleAddressChange = useCallback(
    (name: keyof Address, value: string | number | boolean) => {
      setAddress((prevAddress) => ({
        ...prevAddress,
        [name]: value
      }));
    },
    []
  );

  const setEntireAddress = useCallback((newAddress: Address | undefined) => {
    setAddress(newAddress);
  }, []);

  const memoAddress = useMemo(() => {
    return address;
  }, [address?.address, address?.address2, address?.region, address?.zipcode, address?.countryId]);

  return {
    address: memoAddress,
    handleAddressChange,
    setEntireAddress
  };
};

export default useAddressInput;
