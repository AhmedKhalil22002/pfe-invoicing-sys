import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const useBankAccount = () => {
  const { isPending: isFetchBankAccountsPending, data: bankAccountsResp } = useQuery({
    queryKey: ['bankAccounts'],
    queryFn: () => api.bankAccount.find(),
    retry: 1,
    refetchOnWindowFocus: false
  });

  const bankAccounts = React.useMemo(() => {
    if (!bankAccountsResp) return [];
    return bankAccountsResp;
  }, [bankAccountsResp]);

  return {
    bankAccounts,
    isFetchBankAccountsPending
  };
};

export default useBankAccount;
