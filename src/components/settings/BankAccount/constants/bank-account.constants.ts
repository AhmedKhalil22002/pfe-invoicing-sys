export const BANK_ACCOUNT_COLUMNS = [
  {
    code: 'bank_account.attributes.name',
    key: 'name',
    default: true,
    canBeFiltred: true,
    canBeSorted: true
  },
  {
    code: 'bank_account.attributes.bic',
    key: 'bic',
    default: true,
    canBeFiltred: true,
    canBeSorted: true
  },
  {
    code: 'bank_account.attributes.iban',
    key: 'iban',
    default: true,
    canBeFiltred: true,
    canBeSorted: true
  },
  {
    code: 'bank_account.attributes.rib',
    key: 'rib',
    default: true,
    canBeFiltred: true,
    canBeSorted: true
  },
  {
    code: 'bank_account.attributes.currency',
    key: 'currency.label',
    default: true,
    canBeFiltred: true,
    canBeSorted: true
  },
  {
    code: 'bank_account.attributes.isMain',
    key: 'isMain',
    default: true,
    canBeFiltred: false,
    canBeSorted: true
  }
];
