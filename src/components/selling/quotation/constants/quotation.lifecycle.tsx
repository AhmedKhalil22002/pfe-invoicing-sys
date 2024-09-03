import { QUOTATION_STATUS } from '@/api';
import { Check, Copy, File, FilePlus, Printer, Save, Send, X } from 'lucide-react';

export interface QuotationLifecycle {
  label: string;
  variant: 'default' | 'outline';
  icon: React.ReactNode;
  when: { set: (QUOTATION_STATUS | undefined)[]; membership: 'IN' | 'OUT' };
}

const QUOTATION_LIFECYCLE_ACTIONS: Record<string, QuotationLifecycle> = {
  save: {
    label: 'Enregistrer',
    variant: 'default',

    icon: <Save className="h-5 w-5" />,
    when: { membership: 'OUT', set: [undefined] }
  },
  draft: {
    label: 'Brouillon',
    variant: 'default',

    icon: <Save className="h-5 w-5" />,
    when: { membership: 'IN', set: [undefined] }
  },
  validated: {
    label: 'Valider',
    variant: 'default',

    icon: <FilePlus className="h-5 w-5" />,
    when: {
      membership: 'IN',
      set: [undefined, QUOTATION_STATUS.Draft, QUOTATION_STATUS.Sent]
    }
  },
  sent: {
    label: 'Envoyer',
    variant: 'default',
    icon: <Send className="h-5 w-5" />,
    when: {
      membership: 'IN',
      set: [undefined, QUOTATION_STATUS.Draft, QUOTATION_STATUS.Validated]
    }
  },
  accepted: {
    label: 'Accepter',
    variant: 'default',
    icon: <Check className="h-5 w-5" />,
    when: {
      membership: 'IN',
      set: [QUOTATION_STATUS.Sent]
    }
  },
  rejected: {
    label: 'Refuser',
    variant: 'default',
    icon: <X className="h-5 w-5" />,
    when: {
      membership: 'IN',
      set: [QUOTATION_STATUS.Sent]
    }
  },
  duplicate: {
    label: 'Dupliquer',
    variant: 'default',
    icon: <Copy className="h-5 w-5" />,
    when: {
      membership: 'OUT',
      set: [undefined]
    }
  },
  print: {
    label: 'Imprimer',
    variant: 'default',
    icon: <Printer className="h-5 w-5" />,
    when: {
      membership: 'OUT',
      set: [undefined]
    }
  },

  reset: {
    label: 'Initialiser',
    variant: 'outline',
    icon: <X className="h-5 w-5" />,
    when: { set: [], membership: 'OUT' }
  }
};

export default QUOTATION_LIFECYCLE_ACTIONS;
