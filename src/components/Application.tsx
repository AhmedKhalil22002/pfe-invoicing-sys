import React from 'react';
import { AppProps } from 'next/app';
import { Layout } from './layout';
import { useRouter } from 'next/router';
import { IMenuItem } from '@/components/layout/interfaces/MenuItem.interface';
import { useTranslation } from 'react-i18next';
import { Spinner } from './common';
import { Slide, ToastContainer } from 'react-toastify';
import { useTheme } from 'next-themes';

interface ApplicationProps {
  className?: string;
  Component: React.ComponentType<AppProps>;
  pageProps: AppProps;
  items: IMenuItem[];
}

function Application({ Component, pageProps, items }: ApplicationProps) {
  const router = useRouter();
  const { ready } = useTranslation();
  const { theme } = useTheme();

  if (router.pathname.includes('admin') || !ready) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Spinner />
      </main>
    );
  }

  return (
    <div className={`flex min-h-screen flex-col`}>
      {router.pathname.includes('auth') ? (
        <Component {...pageProps} />
      ) : (
        <Layout className="flex w-full" items={items}>
          <Component {...pageProps} />
          <ToastContainer
            toastClassName={'duration-200'}
            className={'duration-'}
            position="bottom-right"
            hideProgressBar={true}
            stacked={true}
            bodyClassName={'text-base rounded-md duration-200'}
            transition={Slide}
            theme={theme == 'dark' ? 'dark' : 'light'}
          />
        </Layout>
      )}
    </div>
  );
}

export default Application;
