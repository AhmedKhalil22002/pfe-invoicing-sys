import React from 'react';
import { Container } from '@/components/common';
import { useRouter } from 'next/router';
import { FirmMain } from '@/components/contacts/FirmMain';
import { FirmForm } from '@/components/contacts/ContactForm';

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
      content = <div>Contacts</div>;
      break;
  }

  return (
    <div className="flex w-full">
      <Container className="mx-2 p-5 w-full">{content}</Container>
    </div>
  );
};

export default Contacts;
