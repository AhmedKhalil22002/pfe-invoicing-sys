import { QUOTATION_STATUS } from '@/api';
import { Check, Copy, File, FilePlus, Send, X } from 'lucide-react';

export interface QuotationLifecycle {
  label: string;
  icon: React.ReactNode;
  when: { set: (QUOTATION_STATUS | undefined)[]; membership: 'IN' | 'OUT' };
}

const QUOTATION_LIFECYCLE_ACTIONS: Record<string, QuotationLifecycle> = {
  reset: {
    label: 'Initialiser',
    icon: <X className="h-5 w-5" />,
    when: { set: [], membership: 'OUT' }
  },
  draft: {
    label: 'Brouillon',
    icon: <File className="h-5 w-5" />,
    when: { membership: 'IN', set: [undefined, QUOTATION_STATUS.Draft] }
  },
  validated: {
    label: 'Valider',
    icon: <FilePlus className="h-5 w-5" />,
    when: {
      membership: 'IN',
      set: [undefined, QUOTATION_STATUS.Draft, QUOTATION_STATUS.Sent]
    }
  },
  sent: {
    label: 'Envoyer',
    icon: <Send className="h-5 w-5" />,
    when: {
      membership: 'IN',
      set: [QUOTATION_STATUS.Draft, QUOTATION_STATUS.Validated, QUOTATION_STATUS.Sent]
    }
  },
  accepted: {
    label: 'Accepter',
    icon: <Check className="h-5 w-5" />,
    when: {
      membership: 'IN',
      set: [QUOTATION_STATUS.Sent]
    }
  },
  rejected: {
    label: 'Refuser',
    icon: <X className="h-5 w-5" />,
    when: {
      membership: 'IN',
      set: [QUOTATION_STATUS.Sent]
    }
  },
  duplicate: {
    label: 'Dupliquer',
    icon: <Copy className="h-5 w-5" />,
    when: {
      membership: 'OUT',
      set: [undefined]
    }
  }
};

export default QUOTATION_LIFECYCLE_ACTIONS;
