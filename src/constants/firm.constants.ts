export const FIRM_COLUMNS = [
  {
    code: 'firm.attributes.entreprise_name',
    key: 'name',
    default: true,
    canBeFiltred: true,
    canBeSorted: true
  },
  {
    code: 'firm.attributes.main_interlocurtor_name',
    key: 'interlocutorsToFirm.interlocutor.name',
    default: false,
    canBeFiltred: true,
    canBeSorted: true
  },
  {
    code: 'firm.attributes.main_interlocurtor_surname',
    key: 'interlocutorsToFirm.interlocutor.surname',
    default: false,
    canBeFiltred: true,
    canBeSorted: true
  },
  {
    code: 'firm.attributes.phone',
    key: 'phone',
    default: true,
    canBeFiltred: true,
    canBeSorted: true
  },
  {
    code: 'firm.attributes.website',
    key: 'website',
    default: true,
    canBeFiltred: true,
    canBeSorted: true
  },
  {
    code: 'firm.attributes.tax_number',
    key: 'taxIdNumber',
    default: false,
    canBeFiltred: true,
    canBeSorted: true
  },
  {
    code: 'firm.attributes.type',
    key: 'isPerson',
    default: true,
    canBeFiltred: false,
    canBeSorted: true
  },
  {
    code: 'firm.attributes.activity',
    key: 'activity.label',
    default: true,
    canBeFiltred: true,
    canBeSorted: true
  },
  {
    code: 'firm.attributes.currency',
    key: 'currency.label',
    default: true,
    canBeFiltred: true,
    canBeSorted: true
  },
  {
    code: 'firm.attributes.created_at',
    key: 'createdAt',
    default: false,
    canBeFiltred: false,
    canBeSorted: true
  }
];
