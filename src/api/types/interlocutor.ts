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
  isDeleteRestricted?: boolean;
};

export const INTERLOCUTOR_COLUMNS = [
  {
    code: 'interlocutor.attributes.title',
    key: '[title]',
    default: true,
    canBeSearch: true,
    alwaysVisible: true
  },
  {
    code: 'interlocutor.attributes.name',
    key: '[name]',
    default: true,
    canBeSearch: true,
    alwaysVisible: true
  },
  {
    code: 'interlocutor.attributes.surname',
    key: '[surname]',
    default: true,
    canBeSearch: true,
    alwaysVisible: true
  },
  {
    code: 'interlocutor.attributes.phone',
    key: '[phone]',
    default: true,
    canBeSearch: true,
    alwaysVisible: true
  },
  {
    code: 'interlocutor.attributes.email',
    key: '[email]',
    default: true,
    canBeSearch: true,
    alwaysVisible: true
  },
  {
    code: 'interlocutor.attributes.created_at',
    key: '[createdAt]',
    default: true,
    alwaysVisible: true
  },
  {
    code: 'is_main',
    key: '[isMain]',
    default: true,
    alwaysVisible: false
  }
];
