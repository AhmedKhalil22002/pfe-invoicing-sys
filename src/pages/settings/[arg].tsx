import React from 'react';
import { Container, Page404, Spinner } from '@/components/common';
import { useRouter } from 'next/router';
import { InformationalSettings } from '@/components/settings/InformationalSettings';
import { SystemSettings } from '@/components/settings/SystemSettings';

const Settings = () => {
  const router = useRouter();
  const { arg } = router.query;

  const content = React.useMemo(() => {
    if (typeof arg === 'string') {
      switch (arg) {
        case 'informations':
          return <InformationalSettings />;
        case 'system':
          return <SystemSettings />;
        default:
          return <Page404 />;
      }
    }
    return <Spinner className="h-screen" />;
  }, [arg]);

  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">{content}</div>
    </Container>
  );
};

export default Settings;
