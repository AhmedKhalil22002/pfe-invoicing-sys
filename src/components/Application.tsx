import React from 'react';
import { AppProps } from 'next/app';
import { Layout } from './layout';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface ApplicationProps {
  Component: any;
  pageProps: AppProps;
}

function Application({ Component, pageProps }: ApplicationProps) {
  const router = useRouter();

  if (router.pathname.includes('admin')) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </main>
    );
  }

  return (
    <div className={`flex min-h-screen flex-col ${inter.className}`}>
      {router.pathname.includes('auth') ? (
        <Component {...pageProps} />
      ) : (
        <Layout className="flex w-full">
          <Component {...pageProps} />
        </Layout>
      )}
    </div>
  );
}

export default Application;
