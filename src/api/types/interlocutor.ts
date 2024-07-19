export type Interlocutor = {
  id?: number;
  title?: string;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export const INTERLOCUTOR_COLUMNS = [
  {
    name: 'Civilité',
    key: '[title]',
    default: true,
    canBeSearch: true,
    alwaysVisible: true
  },
  {
    name: 'Nom',
    key: '[name]',
    default: true,
    canBeSearch: true,
    alwaysVisible: true
  },
  {
    name: 'Prénom',
    key: '[surname]',
    default: true,
    canBeSearch: true,
    alwaysVisible: true
  },
  {
    name: 'Teléphone',
    key: '[phone]',
    default: true,
    canBeSearch: true,
    alwaysVisible: true
  },
  {
    name: 'E-mail',
    key: '[email]',
    default: true,
    canBeSearch: true,
    alwaysVisible: true
  },
  {
    name: 'Date de Création',
    key: '[createdAt]',
    default: true,
    alwaysVisible: true
  },
  {
    name: 'Principale',
    key: '[isMain]',
    default: true,
    alwaysVisible: false
  }
];
