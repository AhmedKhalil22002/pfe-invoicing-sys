import React from 'react';
import { Container, Spinner } from '@/components/common';
import { useRouter } from 'next/router';
import { FirmMain } from '@/components/contacts/FirmMain';
import { FirmForm } from '@/components/contacts/FirmForm';

const Contacts = () => {
  const router = useRouter();

  let content;
  switch (router.query.tab) {
    case 'general':
      content = <FirmMain />;
      break;
    case 'new-firm':
      content = <FirmForm />;
      break;
    default:
      content = <Spinner className='h-screen'/>;
      break;
  }

  return (
    <div className="flex w-full">
      <Container className="mx-2 p-5 w-full">{content}</Container>
    </div>
  );
};

export default Contacts;
