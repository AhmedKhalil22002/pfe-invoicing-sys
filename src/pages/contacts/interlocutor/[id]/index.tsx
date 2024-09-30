import React from 'react';
import { Spinner } from '@/components/common';
import { useRouter } from 'next/router';
import { InterlocutorDetails } from '@/components/contacts/interlocutor/InterlocutorDetails';

export default function Page() {
  const router = useRouter();

  const id = router.query.id as string;
  const tab = router.query.tab as string;

  const content = React.useMemo(() => {
    if (!id) return <Spinner className="h-screen" />;
    if (!tab)
      return (
        <InterlocutorDetails className="px-5 pt-8" defaultValue={['overview', 'entreprise']} />
      );
    else if (tab === 'entreprise' || tab === 'interlocutors')
      return (
        <InterlocutorDetails className="px-5 pt-8" firmId={id} defaultValue={['overview', tab]} />
      );
    else if (tab)
      return <InterlocutorDetails className="px-5 pt-8" firmId={id} defaultValue={[tab]} />;
  }, [id, tab]);

  return <div className="flex-1 flex flex-col overflow-hidden">{content}</div>;
}
