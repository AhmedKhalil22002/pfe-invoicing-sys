import { useState, useCallback, useMemo } from 'react';
import { BankAccount } from '@/types';

const useBankAccountInput = (initialBankAccount: BankAccount) => {
  const [bankAccount, setBankaccount] = useState<BankAccount | undefined>(initialBankAccount);

  const handleBankAccount = useCallback((name: keyof BankAccount, value: any) => {
    setBankaccount((prevBankAccount) => ({
      ...prevBankAccount,
      [name]: value
    }));
  }, []);

  const setEntireBankAccount = useCallback((newBankAccount: BankAccount | undefined) => {
    setBankaccount(newBankAccount);
  }, []);

  const memoBankAccount = useMemo(() => {
    return bankAccount;
  }, [
    bankAccount?.name,
    bankAccount?.bic,
    bankAccount?.currency,
    bankAccount?.rib,
    bankAccount?.iban,
    bankAccount?.isMain
  ]);

  return {
    bankAccount: memoBankAccount,
    handleBankAccount,
    setEntireBankAccount
  };
};

export default useBankAccountInput;
