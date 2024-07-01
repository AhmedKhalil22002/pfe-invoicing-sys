import React from 'react';
import { Container, Spinner } from '@/components/common';
import { useRouter } from 'next/router';
import { FirmMain } from '@/components/contacts/FirmMain';
import { FirmForm } from '@/components/contacts/FirmForm';

const Contacts = () => {
  const router = useRouter();

  let content;
  switch (router.query.tab) {
    case 'firms':
      content = <FirmMain />;
      break;
    case 'new-firm':
      content = <FirmForm />;
      break;
    default:
      content = <Spinner className="h-screen" />;
      break;
  }

  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="p-5 w-full overflow-auto">{content}</div>
    </Container>
  );
};

export default Contacts;
