import { MenuItem } from '@/components/layout/interfaces/MenuItem.interface';

export const settings: { title: string; items: Omit<MenuItem, 'icon' | 'code'>[] }[] = [
  {
    title: 'Réglage Compte',
    items: [
      { title: 'Mon Profile', href: '/settings/general' },
      { title: 'Cabinet', href: '/settings/cabinet' },
      { title: 'Banques', href: '/settings/banks' }
    ]
  },
  {
    title: 'Réglage Systéme',
    items: [
      { title: 'Activités', href: '/settings/activity' },
      { title: 'Séquence de numérotation', href: '/settings/sequence' },
      { title: 'Méthode de Paiement', href: '/settings/payement' },
      { title: 'Type de Retenue', href: '/settings/withholding-type' },
      { title: 'Synthèse des Taxes', href: '/settings/tax' },
      { title: 'Conditions par défaut', href: '/settings/default-conditions' }
    ]
  },
  {
    title: 'Autres Réglage',
    items: [
      { title: 'Other 1', href: '/settings/other1' },
      { title: 'Other 2', href: '/settings/other2' }
    ]
  }
];
