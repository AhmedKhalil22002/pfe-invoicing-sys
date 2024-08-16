import React from 'react';
import {
  Settings,
  Home,
  Package,
  ShoppingCart,
  Users,
  UserCog,
  Wrench,
  FileCog,
  Building,
  File,
  FileText,
  Magnet,
  BookUser,
  Braces,
  Database,
  Printer
} from 'lucide-react';
import { IMenuItem } from './interfaces/MenuItem.interface';

const NODE_ENV =
  typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_NODE_ENV : process.env.NODE_ENV;

const baseMenuItems = [
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
        title: 'Entreprises',
        href: '/contacts/firms',
        icon: <Building className="h-5 w-5" />
      },
      {
        code: 'interlocutors',
        title: 'Interlocuteurs',
        href: '/contacts/interlocutors',
        icon: <BookUser className="h-5 w-5" />
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
        code: 'quotations',
        title: 'Devis',
        href: '/selling/quotations',
        icon: <File className="h-5 w-5" />
      },
      {
        code: 'invoices',
        title: 'Factures',
        href: '/selling/invoices',
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
        code: 'quotations',
        title: 'Devis',
        href: '/buying/quotation',
        icon: <File className="h-5 w-5" />
      },
      {
        code: 'invoices',
        title: 'Factures',
        href: '/buying/invoice',
        icon: <FileText className="h-5 w-5" />
      },
      {
        code: 'withholding',
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
        href: '/settings/Information',
        icon: <UserCog className="h-5 w-5" />
      },
      {
        code: 'system',
        title: 'Réglage Systéme',
        href: '/settings/system',
        icon: <FileCog className="h-5 w-5" />
      },
      {
        code: 'pdf',
        title: 'Reglage PDF',
        href: '/settings/pdf',
        icon: <Printer className="h-5 w-5" />
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

export const menuItems: IMenuItem[] = [...baseMenuItems];
