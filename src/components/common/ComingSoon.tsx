import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ComingSoonProps {
  className?: string;
}

export const ComingSoon = ({ className }: ComingSoonProps) => {
  return (
    <div className={cn(className)}>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-8xl text-primary-600 dark:text-primary-500">
              Coming Soon
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              Quelque chose d&apos;incroyable arrive bientôt !
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              Nous travaillons dur pour vous apporter de nouvelles fonctionnalités. Restez à
              l&apos;écoute !
            </p>
            <Link
              href="/dashboard"
              className="inline-flex bg-primary-600 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
