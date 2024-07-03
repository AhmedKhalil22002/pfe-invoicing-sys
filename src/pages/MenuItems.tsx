import React from 'react';
import {
  Settings,
  Home,
  Package,
  ShoppingCart,
  Users,
  UserCog,
  UserSearch,
  Wrench,
  FileCog,
  Building,
  File,
  FileText,
  Magnet
} from 'lucide-react';
import { IMenuItem } from './interfaces/MenuItem.interface';

export const menuItems: IMenuItem[] = [
  {
    id: 1,
    code: 'dashboard',
    title: 'Dashboard',
    icon: <Home className="h-5 w-5" />,
    subMenu: []
  },
  {
    id: 2,
    code: 'contacts',
    title: 'Contacts',
    icon: <Users className="h-5 w-5" />,
    subMenu: [
      {
        code: 'firms',
        title: 'Firmes',
        href: '/contacts/firms',
        icon: <Building className="h-5 w-5" />
      },
      {
        code: 'prospects',
        title: 'Prospects',
        href: '/contacts/prospects',
        icon: <UserSearch className="h-5 w-5" />
      }
    ]
  },
  {
    id: 3,
    code: 'selling',
    title: 'Vente',
    icon: <Package className="h-5 w-5" />,
    subMenu: [
      {
        code: 'quotation',
        title: 'Devis',
        href: '/selling/quotation',
        icon: <File className="h-5 w-5" />
      },
      {
        code: 'invoice',
        title: 'Factures',
        href: '/selling/invoice',
        icon: <FileText className="h-5 w-5" />
      }
    ]
  },
  {
    id: 4,
    code: 'buying',
    title: 'Achat',
    icon: <ShoppingCart className="h-5 w-5" />,
    subMenu: [
      {
        code: 'quotation',
        title: 'Devis',
        href: '/buying/quotation',
        icon: <File className="h-5 w-5" />
      },
      {
        code: 'invoice',
        title: 'Factures',
        href: '/buying/invoice',
        icon: <FileText className="h-5 w-5" />
      },
      {
        code: 'witholding',
        title: 'Retenue à la source',
        href: '/buying/withholding',
        icon: <Magnet className="h-5 w-5" />
      }
    ]
  },
  {
    id: 5,
    code: 'settings',
    title: 'Réglages',
    icon: <Settings className="h-5 w-5" />,
    subMenu: [
      {
        code: 'account',
        title: 'Réglage Information',
        href: '/settings/informations',
        icon: <UserCog className="h-5 w-5" />
      },
      {
        code: 'system',
        title: 'Réglage Systéme',
        href: '/settings/system',
        icon: <FileCog className="h-5 w-5" />
      },
      {
        code: 'other',
        title: 'Autres Réglage',
        href: '/settings/general',
        icon: <Wrench className="h-5 w-5" />
      }
    ]
  }
];
