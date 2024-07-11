import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const useCountry = () => {
  const { isPending: isFetchCountriesPending, data: countriesResp } = useQuery({
    queryKey: ['countries'],
    queryFn: () => api.country.find()
  });

  const countries = React.useMemo(() => {
    if (!countriesResp) return [];
    return countriesResp;
  }, [countriesResp]);

  return {
    countries,
    isFetchCountriesPending
  };
};

export default useCountry;
