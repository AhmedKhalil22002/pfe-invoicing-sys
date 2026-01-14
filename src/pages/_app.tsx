import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Application from '@/components/Application';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { appWithTranslation } from 'next-i18next';
import nextI18nextConfig from '../../next-i18next.config';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import '@/styles/globals.css';

const inter = { className: 'font-inter' };
const queryClient = new QueryClient();

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <>
      <Head>
        <title>ZC INVOICE</title>
        <meta name="description" content="Zedney Creative Invoice" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange>
            <Application Component={Component} pageProps={pageProps} className={inter.className} />
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
};

export default appWithTranslation(App, nextI18nextConfig);
