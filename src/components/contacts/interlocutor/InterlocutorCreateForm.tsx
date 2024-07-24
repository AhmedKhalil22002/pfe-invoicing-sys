import React from 'react';
import { CreateInterlocutorDto, UpdateFirmDto, api } from '@/api';
import { BreadcrumbCommon, Spinner } from '@/components/common';
import { cn } from '@/lib/utils';
import { useInterlocutorManager } from '@/hooks/functions/useInterlocutorManager';
import useFirmChoices from '@/hooks/content/useFirmChoice';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/errors';
import { InterlocutorGeneralInformation, InterlocutorProfessionalInformation } from './form';
import { useTranslation } from 'react-i18next';

interface InterlocutorFormProps {
  className?: string;
  firmId?: number;
}

export const InterlocutorCreateForm: React.FC<InterlocutorFormProps> = ({ className, firmId }) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');

  // Fetch options
  const { firms, isFetchFirmsPending } = useFirmChoices({
    id: true,
    name: true,
    mainInterlocutor: true
  });

  const interlocutorManager = useInterlocutorManager();

  const createInterlocutorAndAssociate = async (
    data: ReturnType<typeof interlocutorManager.mergeData>
  ) => {
    const interlocutor = await api.interlocutor.create(data);
    if (firmId) {
      await api.firm.update({ id: firmId, interlocutors: [interlocutor] });
    } else {
      const firmIds = interlocutorManager.getFirms();
      for (const id of firmIds) {
        await api.firm.update({ id: id, interlocutors: [interlocutor] });
      }
    }
  };

  const { mutate: createInterlocutor, isPending: isCreatePending } = useMutation({
    mutationFn: (data: ReturnType<typeof interlocutorManager.mergeData>) =>
      createInterlocutorAndAssociate(data),
    onSuccess: () => {
      if (firmId) router.push(`/contacts/firm/${firmId}/?tab=interlocutors`);
      else router.push(`/contacts/interlocutors`);
      toast.success(tContacts('interlocutor.action_add_success'), { position: 'bottom-right' });
    },
    onError: (error) => {
      const message = getErrorMessage(error, tContacts('interlocutor.action_add_failure'));
      toast.error(message, {
        position: 'bottom-right'
      });
    }
  });

  const globalReset = () => {
    interlocutorManager.reset();
    interlocutorManager.add();
  };

  const handleSubmit = () => {
    const data: CreateInterlocutorDto = interlocutorManager.mergeData();
    const validation = api.interlocutor.validate(data);
    if (validation.message)
      toast.error(validation.message, {
        position: validation.position || 'bottom-right'
      });
    else {
      createInterlocutor(data);
    }
  };

  React.useEffect(() => {
    if (interlocutorManager.firms.length == 0) interlocutorManager.add();
  }, []);

  const loading = isCreatePending || isFetchFirmsPending;
  if (loading) return <Spinner className="h-screen" show={loading} />;

  return (
    <div className={cn('overflow-auto p-8', className)}>
      <BreadcrumbCommon
        hierarchy={[
          { title: 'Contacts', href: '/contacts' },
          {
            title: firmId
              ? `${tContacts('firm.singular')} N°${firmId}`
              : tContacts('interlocutor.plural'),
            href: firmId ? `/contacts/firm?id=${firmId}` : '/contacts/interlocutors'
          },
          {
            title:
              tContacts('interlocutor.new') +
              (firmId ? ` ${tCommon('words.for')} ${tContacts('firm.singular')} N°${firmId}` : '')
          }
        ]}
      />

      <div className="grid grid-cols-1 gap-4">
        <InterlocutorGeneralInformation />
        {!firmId && <InterlocutorProfessionalInformation firms={firms} />}
        <div className="flex my-5">
          <Button className="ml-3" onClick={handleSubmit}>
            {tCommon('commands.save')}
            <Spinner className="ml-2" size={'small'} show={isCreatePending} />
          </Button>
          <Button variant="secondary" className="border-2 ml-3" onClick={globalReset}>
            {tCommon('commands.cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
};
