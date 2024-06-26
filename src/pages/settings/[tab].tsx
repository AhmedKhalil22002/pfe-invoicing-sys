import React from 'react';
import { Container, Spinner } from '@/components/common';
import { SideMenu } from '@/components/layout/SideMenu';
import { settings } from './settings';
import { useRouter } from 'next/router';
import ActivityMain from '@/components/settings/Activity/ActivityMain';
import TaxMain from '@/components/settings/Tax/TaxMain';
import CabinetMain from '@/components/settings/Cabinet/CabinetMain';

const Settings = () => {
  const router = useRouter();

  let content;
  switch (router.query.tab) {
    case 'cabinet':
      content = <CabinetMain />;
      break;
    case 'activity':
      content = <ActivityMain />;
      break;
    case 'tax':
      content = <TaxMain />;
      break;
    default:
      content = <Spinner className="h-screen" />;
      break;
  }

  return (
    <div className="flex w-full">
      <Container className="mx-2 p-2 w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6">
        <SideMenu menuItems={settings} />
      </Container>
      <Container className="mx-2 p-5 w-2/3 md:w-3/4 lg:w-4/5 xl:w-5/6">{content}</Container>
    </div>
  );
};

export default Settings;
