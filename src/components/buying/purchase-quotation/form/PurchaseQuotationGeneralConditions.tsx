import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { usePurchaseQuotationManager } from '../hooks/usePurchaseQuotationManager';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

interface PurchaseQuotationGeneralConditionsProps {
  className?: string;
  hidden?: boolean;
  isPending?: boolean;
  defaultCondition?: string;
  edit?: boolean;
}

export const PurchaseQuotationGeneralConditions = ({
  className,
  hidden,
  isPending,
  defaultCondition,
  edit = true
}: PurchaseQuotationGeneralConditionsProps) => {
  const router = useRouter();
  const { t: tInvoicing } = useTranslation('invoicing');
  const { t: tSettings } = useTranslation('settings');

  const purchaseQuotationManager = usePurchaseQuotationManager();

  return (
    <div className={cn(className)}>
      {!hidden && (
        <div className="flex flex-col gap-4">
          <Textarea
            disabled={!edit}
            placeholder={tInvoicing('purchase-quotation.attributes.general_condition')}
            className="resize-none"
            value={purchaseQuotationManager.generalConditions}
            onChange={(e) => purchaseQuotationManager.set('generalConditions', e.target.value)}
            rows={7}
          />
          {edit && defaultCondition && (
            <div className="flex items-center gap-4">
              <div className="flex gap-2 items-center">
                <Button
                  disabled={purchaseQuotationManager.generalConditions == defaultCondition}
                  onClick={() => {
                    purchaseQuotationManager.set('generalConditions', defaultCondition);
                  }}>
                  {tInvoicing('purchase-quotation.use_default_condition')}
                </Button>
                <Button
                  variant={'secondary'}
                  onClick={() => {
                    purchaseQuotationManager.set('generalConditions', '');
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
