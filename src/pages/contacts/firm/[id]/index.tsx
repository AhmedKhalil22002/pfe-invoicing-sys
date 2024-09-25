import React from 'react';
import { Container, Spinner } from '@/components/common';
import { FirmDetails } from '@/components/contacts/firm';
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();

  const id = router.query.id as string;
  const tab = router.query.tab as string;

  const content = React.useMemo(() => {
    if (!id) return <Spinner className="h-screen" />;
    if (!tab)
      return (
        <FirmDetails className="px-5 pt-8" firmId={id} defaultValue={['overview', 'entreprise']} />
      );
    else if (tab === 'entreprise' || tab === 'interlocutors')
      return <FirmDetails className="px-5 pt-8" firmId={id} defaultValue={['overview', tab]} />;
    else if (tab) return <FirmDetails className="px-5 pt-8" firmId={id} defaultValue={[tab]} />;
  }, [id, tab]);

  return <Container className="flex-1 flex flex-col overflow-hidden">{content}</Container>;
}
