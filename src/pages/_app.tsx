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
import { ThemeProvider } from '@/components/theme-provider';

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>ZC-Invoice</title>
        <meta name="description" content="ZC-Invoice" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>{' '}
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <ToastContainer
            toastClassName={'duration-200'}
            className={'duration-200'}
            position="bottom-left"
            bodyClassName={'text-sm rounded-md duration-200'}
            transition={Slide}
          />
          <Application Component={Component} pageProps={pageProps} items={menuItems} />
        </ThemeProvider>{' '}
      </QueryClientProvider>
    </>
  );
};

export default appWithTranslation(App);
