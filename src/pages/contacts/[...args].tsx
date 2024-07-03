import React from 'react';
import { Container, Page404, Spinner } from '@/components/common';
import { useRouter } from 'next/router';
import { FirmMain } from '@/components/contacts/firm/FirmMain';
import { FirmCreateForm } from '@/components/contacts/firm/FirmCreateForm';
import { FirmDetails } from '@/components/contacts/firm/FirmDetails';
import { FirmUpdateForm } from '@/components/contacts/firm';

const Contacts = () => {
  const router = useRouter();
  const { args } = router.query;

  const content = React.useMemo(() => {
    if (typeof args === 'object') {
      switch (args[0]) {
        case 'firm':
          return <FirmDetails firmId={args[1]} />;
        case 'firms':
          return <FirmMain />;
        case 'modify-firm':
          return <FirmUpdateForm firmId={args[1]} />;
        case 'new-firm':
          return <FirmCreateForm />;
        default:
          return <Page404 />;
      }
    }
    return <Spinner className="h-screen" />;
  }, [args]);

  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">{content}</div>
    </Container>
  );
};

export default Contacts;
