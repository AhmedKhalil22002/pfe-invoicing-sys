import { Spinner } from '@/components/common';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { SequentialItem } from './SequentialItem';
import useConfig from '@/hooks/content/useConfig';
import { useSequentialsManager } from './hooks/useSequentialManager';
import React from 'react';
import { DATE_FORMAT } from '@/types/enums/date-formats';
import { useMutation } from '@tanstack/react-query';
import { UpdateAppConfigDto } from '@/types';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'react-toastify';
import { api } from '@/api';
import { cn } from '@/lib/utils';

interface SequentialMainProps {
  className?: string;
}

export const SequentialMain: React.FC<SequentialMainProps> = ({ className }) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');

  const sequentialsManager = useSequentialsManager();
  const { configs: sequentials, isConfigPending: isSequentialsPending } = useConfig([
    'quotation_sequence',
    'invoice_sequence'
  ]);

  React.useEffect(() => {
    if (!isSequentialsPending) {
      sequentialsManager.setSequentials(sequentials);
    }
  }, [sequentials]);

  const { mutate: updateSequential } = useMutation({
    mutationFn: (updateSequential: UpdateAppConfigDto) => api.appConfig.update(updateSequential),
    onSuccess: (data) => {
      toast.success(`${tSettings(`sequence.${data.key}`)} mises à jour avec succès`);
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, 'Erreur lors de la mise à jour'));
    }
  });

  const handleSubmit = async () => {
    for (const sequential of sequentialsManager.sequentials) {
      updateSequential(sequential);
    }
  };

  return (
    <div className={cn('p-10', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">{tSettings('sequence.title')}</CardTitle>
          <CardDescription>{tSettings('sequence.card_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {sequentialsManager.sequentials.map((sequential) => (
              <SequentialItem
                id={sequential.id}
                key={sequential.id}
                title={tSettings(`sequence.elements.${sequential.key?.slice(0, -9)}`)}
                prefix={sequential.value.prefix || ''}
                dynamicSequence={sequential.value.dynamicSequence || DATE_FORMAT.yyyy}
                nextNumber={sequential.value.next || 0}
                loading={isSequentialsPending}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex justify-end w-full gap-2">
            <Button onClick={handleSubmit}>
              {tCommon('commands.save')}
              {isSequentialsPending && <Spinner show />}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                sequentialsManager.setSequentials(sequentials);
              }}>
              {tCommon('commands.cancel')}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
