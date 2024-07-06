import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { appWithTranslation } from 'next-i18next';
import { Slide, ToastContainer } from 'react-toastify';
import Application from '@/components/Application';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { menuItems } from '../components/layout/MenuItems';
import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
  console.log(process.env.NEXT_PUBLIC_BASE_URL);
  return (
    <>
      <Head>
        <title>ZC-Invoice</title>
        <meta name="description" content="ZC-Invoice" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          toastClassName={'duration-200'}
          className={'duration-200'}
          position="bottom-left"
          bodyClassName={'text-sm rounded-md duration-200'}
          transition={Slide}
        />
        <Application Component={Component} pageProps={pageProps} items={menuItems} />
      </QueryClientProvider>
    </>
  );
};

export default appWithTranslation(App);
