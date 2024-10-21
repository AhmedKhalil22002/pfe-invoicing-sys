import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { DefaultConditionItem } from './DefaultConditionItem';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import React from 'react';
import { useDefaultConditionManager } from './hooks/useDefaultConditionManager';
import { UpdateDefaultConditionDto } from '@/types';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/errors';
import { ACTIVITY_TYPE } from '@/types/enums/activity-type';
import { Spinner } from '@/components/common';

interface DefaultConditionMainProps {
  className?: string;
}
export const DefaultConditionMain: React.FC<DefaultConditionMainProps> = ({ className }) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');

  const defaultConditionManager = useDefaultConditionManager();

  const {
    isPending: isDefaultConditionsPending,
    data: defaultConditions,
    refetch: refetchDefaultConditions
  } = useQuery({
    queryKey: ['default-conditions'],
    queryFn: () => api.defaultCondition.find()
  });

  React.useEffect(() => {
    if (defaultConditions) {
      defaultConditionManager.setDefaultConditions(defaultConditions);
    }
  }, [defaultConditions]);

  const { mutate: updateDefaultConditions, isPending: isUpdatePending } = useMutation({
    mutationFn: (
      updateDefaultConditions: UpdateDefaultConditionDto | UpdateDefaultConditionDto[]
    ) => api.defaultCondition.update(updateDefaultConditions),
    onSuccess: () => {
      toast.success(tSettings('default_condition.action_edit_success'));
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, tSettings('default_condition.action_edit_failure')));
    }
  });

  const handleSubmitUpdate = () => {
    updateDefaultConditions(defaultConditionManager.defaultConditions);
  };

  return (
    <div className={cn('p-10', className)}>
      <Card className={className}>
        <CardHeader>
          <CardTitle>{tSettings('default_condition.singular')}</CardTitle>
          <CardDescription>{tSettings('default_condition.card_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-5">
            <h1 className="font-bold text-xl border-b pb-2">
              {tSettings('default_condition.section.selling')} :
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
              {defaultConditionManager.defaultConditions
                ?.filter((condition) => {
                  return condition.activity_type == ACTIVITY_TYPE.SELLING;
                })
                .map((condition) => {
                  return (
                    <DefaultConditionItem
                      key={condition.id}
                      title={tSettings(`default_condition.elements.${condition.document_type}`)}
                      value={condition.value || ''}
                      onChange={(value) => {
                        defaultConditionManager.setDefaultConditionById(condition.id || 0, value);
                        refetchDefaultConditions();
                      }}
                    />
                  );
                })}
            </div>
          </div>
          <div className="mt-5">
            <h1 className="font-bold text-xl border-b pb-2">
              {tSettings('default_condition.section.buying')} :
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {defaultConditionManager.defaultConditions
                ?.filter((condition) => {
                  return condition.activity_type == ACTIVITY_TYPE.BUYING;
                })
                .map((condition) => {
                  return (
                    <DefaultConditionItem
                      key={condition.id}
                      title={tSettings(`default_condition.elements.${condition.document_type}`)}
                      value={condition.value || ''}
                      onChange={(value) => {
                        defaultConditionManager.setDefaultConditionById(condition.id || 0, value);
                        refetchDefaultConditions();
                      }}
                    />
                  );
                })}
            </div>
          </div>

          <div className="flex justify-end mt-5">
            <Button className="ml-3" onClick={handleSubmitUpdate}>
              {tCommon('commands.save')}
              <Spinner className="ml-2" size={'small'} show={isUpdatePending} />
            </Button>
            <Button variant="secondary" className="border-2 ml-3">
              {tCommon('commands.cancel')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
