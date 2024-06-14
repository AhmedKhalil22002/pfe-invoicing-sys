import { MenuItem } from '@/components/layout/interfaces/MenuItem.interface';

export const settings: { title: string; items: Omit<MenuItem, 'icon' | 'code'>[] }[] = [
  {
    title: 'Réglage Compte',
    items: [
      { title: 'Mon Profile', href: '/settings/general' },
      { title: 'Entreprise', href: '/settings/entreprise' }
    ]
  },
  {
    title: 'Réglage Systéme',
    items: [
      { title: 'Activités', href: '/settings/activity' },
      { title: 'Séquence de numérotation', href: '/settings/sequence' },
      { title: 'Mode de Paiement', href: '/settings/payement' },
      { title: 'Type de Retenue', href: '/settings/withholding-type' },
      { title: 'Synthèse Des Taxes', href: '/settings/tax' },
      { title: 'Conditions par défaut', href: '/settings/default-conditions' },
      { title: 'Banques', href: '/settings/banks' }
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
