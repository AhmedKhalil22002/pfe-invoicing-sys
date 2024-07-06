import React from 'react';
import { AppProps } from 'next/app';
import { Layout } from './layout';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';
// import { Inter } from 'next/font/google';
import { IMenuItem } from '@/components/layout/interfaces/MenuItem.interface';

// const inter = Inter({ subsets: ['latin'] });

interface ApplicationProps {
  className?: string;
  Component: React.ComponentType<AppProps>;
  pageProps: AppProps;
  items: IMenuItem[];
}

function Application({ Component, pageProps, items }: ApplicationProps) {
  const router = useRouter();

  if (router.pathname.includes('admin')) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
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
        </Layout>
      )}
    </div>
  );
}

export default Application;
