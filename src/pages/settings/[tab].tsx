import React from 'react';
import { Container, Spinner } from '@/components/common';
import { useRouter } from 'next/router';
import { InformationalSettings } from '@/components/settings/InformationalSettings';
import { SystemSettings } from '@/components/settings/SystemSettings';

const Settings = () => {
  const router = useRouter();

  let content;
  switch (router.query.tab) {
    case 'informations':
      content = <InformationalSettings />;
      break;
    case 'system':
      content = <SystemSettings/>;
      break;
    default:
      content = <Spinner className="h-screen" />;
      break;
  }

  return (
    <div className="block md:flex w-full overflow-hidden">
      <Container className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">{content}</div>
      </Container>
    </div>
  );
};

export default Settings;
