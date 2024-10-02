import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useQuotationManager } from '../hooks/useQuotationManager';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Badge } from '@/components/ui/badge';

interface QuotationGeneralConditionsProps {
  className?: string;
  hidden?: boolean;
  isPending?: boolean;
  defaultCondition?: string;
}

export const QuotationGeneralConditions = ({
  className,
  hidden,
  isPending,
  defaultCondition
}: QuotationGeneralConditionsProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const { t: tSettings } = useTranslation('settings');

  const quotationManager = useQuotationManager();

  return (
    <div className={cn(className)}>
      {!hidden && (
        <div className="flex flex-col gap-4">
          <Textarea
            placeholder={tInvoicing('quotation.attributes.general_condition')}
            className="resize-none"
            disabled={quotationManager.defaultCondition === 'USED'}
            value={
              ['UNUSED', 'REBASED'].indexOf(quotationManager.defaultCondition) !== -1
                ? quotationManager.generalConditions
                : defaultCondition
            }
            onChange={(e) => quotationManager.set('generalConditions', e.target.value)}
            isPending={isPending}
            rows={7}
          />
          {defaultCondition && (
            <div className="flex items-center gap-4">
              <div className="flex gap-2 items-center">
                <Switch
                  checked={quotationManager.defaultCondition === 'USED'}
                  onClick={() => {
                    quotationManager.set(
                      'defaultCondition',
                      quotationManager.defaultCondition === 'USED' ? 'UNUSED' : 'USED'
                    );
                    quotationManager.set('generalConditions', '');
                  }}
                />
                <Label>{tInvoicing('quotation.use_default_condition')}</Label>
              </div>
              <Badge> {tCommon('words.or')}</Badge>
              <div className="flex gap-2 items-center">
                <Label
                  className="font-bold underline cursor-pointer"
                  onClick={() => {
                    quotationManager.set(
                      'defaultCondition',
                      quotationManager.defaultCondition === 'REBASED' ? 'UNUSED' : 'REBASED'
                    );
                    quotationManager.set('generalConditions', defaultCondition);
                  }}>
                  {tInvoicing('quotation.use_default_condition_as_model')}
                </Label>
              </div>
            </div>
          )}
          {!defaultCondition && (
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
