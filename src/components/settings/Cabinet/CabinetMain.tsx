import React from 'react';
import { GeneralInformations } from './GeneralInformations';
import { Button } from '@/components/ui/button';
import { AccountingInformations } from './AccountingInformation';
import { useMutation } from '@tanstack/react-query';
import { UpdateCabinetDto, api } from '@/api';
import { Cabinet } from '@/api/types/cabinet';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/errors';
import useCabinet from '@/hooks/content/useCabinet';
import { Form, SubmitHandler, useForm } from 'react-hook-form';
import useCurrency from '@/hooks/content/useCurrency';
import useActivity from '@/hooks/content/useActivity';
import { Spinner } from '@/components/common';
import { cn } from '@/lib/utils';

interface CabinetMainProps {
  className?: string;
}

const CabinetMain: React.FC<CabinetMainProps> = ({ className }) => {
  const { cabinet, isFetchCabinetPending, error, refetchCabinet } = useCabinet();
  const { activities, isFetchActivitiesPending } = useActivity();
  const { currencies, isFetchCurrenciesPending } = useCurrency();

  const { register, control, handleSubmit, watch, reset } = useForm<UpdateCabinetDto>({
    values: cabinet as UpdateCabinetDto
  });

  const onSubmit: SubmitHandler<UpdateCabinetDto> = (data) => {
    const validation = api.cabinet.validate(data);
    if (validation.message)
      toast.error(validation.message, {
        position: validation.position || 'bottom-right'
      });
    else {
      updateCabinet(data);
    }
  };

  const { mutate: updateCabinet, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: Cabinet) => api.cabinet.update(data),
    onSuccess: () => {
      toast.success('Cabinet modifiée avec succès', { position: 'bottom-right' });
      refetchCabinet();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Erreur lors de la modification de du cabinet'), {
        position: 'bottom-right'
      });
    }
  });

  const loading = isFetchCabinetPending || isFetchCurrenciesPending || isFetchActivitiesPending;

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className={cn('mx-10 mt-10', className)}>
      <Form control={control}>
        <GeneralInformations
          className="mt-5"
          isPending={loading}
          register={register}
          control={control}
          watch={watch}
        />
        <AccountingInformations
          className="mt-5"
          isPending={loading}
          activities={activities}
          currencies={currencies}
          register={register}
          control={control}
          watch={watch}
        />
        <div className="flex justify-end mt-5">
          <Button className="ml-3" onClick={handleSubmit(onSubmit)}>
            Enregistrer
            <Spinner className="ml-2" size={'small'} show={isUpdatePending} />
          </Button>
          <Button
            variant="secondary"
            className="border-2 ml-3"
            onClick={() => {
              reset();
            }}>
            Annuler
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CabinetMain;
