import React from 'react';
import { AppProps } from 'next/app';
import { useTranslation } from 'react-i18next';
import { Spinner } from './shared';
import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';
import { AuthContext } from '@/context/AuthContext';
import AuthenticationPage from './auth/AuthentificationMain';
import { Layout } from './layout/Layout';
import { cn } from '@/lib/utils';

interface ApplicationProps {
  className?: string;
  Component: React.ComponentType<AppProps>;
  pageProps: AppProps;
}

function Application({ className, Component, pageProps }: ApplicationProps) {
  const { ready } = useTranslation();
  const { theme } = useTheme();
  const authContext = React.useContext(AuthContext);

  if (!ready) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Spinner />
      </main>
    );
  }

  return (
    <div
      className={cn(`flex flex-col flex-1 overflow-hidden min-h-screen max-h-screen`, className)}>
      {authContext.authenticated ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <AuthenticationPage />
      )}
      <Toaster theme={theme == 'dark' ? 'dark' : 'light'} />
    </div>
  );
}

export default Application;
