import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { usePurchaseInvoiceManager } from '../hooks/usePurchaseInvoiceManager';

interface PurchaseInvoiceGeneralConditionsProps {
  className?: string;
  hidden?: boolean;
  isPending?: boolean;
  defaultCondition?: string;
  edit?: boolean;
}

export const PurchaseInvoiceGeneralConditions = ({
  className,
  hidden,
  isPending,
  defaultCondition,
  edit = true
}: PurchaseInvoiceGeneralConditionsProps) => {
  const router = useRouter();
  const { t: tInvoicing } = useTranslation('invoicing');
  const { t: tSettings } = useTranslation('settings');

  const purchaseInvoiceManager = usePurchaseInvoiceManager();

  return (
    <div className={cn(className)}>
      {!hidden && (
        <div className="flex flex-col gap-4">
          <Textarea
            disabled={!edit}
            placeholder={tInvoicing('purchaseInvoice.attributes.general_condition')}
            className="resize-none"
            value={purchaseInvoiceManager.generalConditions}
            onChange={(e) => purchaseInvoiceManager.set('generalConditions', e.target.value)}
            
            rows={7}
          />
          {edit && defaultCondition && (
            <div className="flex items-center gap-4">
              <div className="flex gap-2 items-center">
                <Button
                  disabled={purchaseInvoiceManager.generalConditions == defaultCondition}
                  onClick={() => {
                    purchaseInvoiceManager.set('generalConditions', defaultCondition);
                  }}>
                  {tInvoicing('purchaseInvoice.use_default_condition')}
                </Button>
                <Button
                  variant={'secondary'}
                  onClick={() => {
                    purchaseInvoiceManager.set('generalConditions', '');
                  }}>
                  Clear
                </Button>
              </div>
            </div>
          )}
          {edit && !defaultCondition && (
            <Label
              className="font-bold underline cursor-pointer"
              onClick={() => router.push('/settings/system/conditions')}>
              {tSettings('default_condition.not_set')}
            </Label>
          )}
        </div>
      )}
    </div>
  );
};
