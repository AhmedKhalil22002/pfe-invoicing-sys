import React from 'react';
import { useBreadcrumb } from '@/components/layout/BreadcrumbContext';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import useLogger from '@/hooks/content/useLogger';
import { DataTable } from './data-table/data-table';
import { getLogColumns } from './data-table/columns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface LoggerMainProps {
  className?: string;
}

export const LoggerMain = ({ className }: LoggerMainProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tLogger } = useTranslation('logger');
  const { setRoutes } = useBreadcrumb();

  const { logs, isFetchLoggerPending } = useLogger();
  React.useEffect(() => {
    setRoutes([
      {
        title: tCommon('menu.administrative_tools'),
        href: '/administrative-tools/user-management/users'
      },
      { title: tCommon('submenu.logger') }
    ]);
  }, [router.locale]);

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden m-5 lg:mx-10', className)}>
      <div className="space-y-0.5 py-5 sm:py-0">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {tLogger('common.singular')}
        </h1>
        <p className="text-muted-foreground">{tLogger('common.description')}</p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex flex-1 flex-col overflow-hidden md:space-y-2">
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1 mb-5"
          containerClassName="overflow-auto"
          data={logs}
          columns={getLogColumns(tCommon, tLogger)}
          isPending={isFetchLoggerPending}
        />
      </div>
    </div>
  );
};
