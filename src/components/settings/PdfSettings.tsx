import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { BreadcrumbCommon } from '../common/Breadcrumb';
import { Page404 } from '../common';
import { useRouter } from 'next/router';
import { ComingSoon } from '../common/ComingSoon';
import { File, TestTubeDiagonalIcon } from 'lucide-react';
import LiveEJSCompiler from './pdf/LiveEJSCompiler';
import { useBreadcrumb } from '../layout/BreadcrumbContext';

interface PdfSettingsProps {
  className?: string;
  defaultValue: string;
}

type TabKey = 'templates' | 'live';

const TABS_CONFIG: Record<
  TabKey,
  { label: string; component: React.ReactNode; icon: React.ReactNode }
> = {
  templates: {
    label: 'templates',
    component: <ComingSoon />,
    icon: <File />
  },
  live: {
    label: 'Document Live Preview',
    component: <LiveEJSCompiler className="p-10" />,
    icon: <TestTubeDiagonalIcon />
  }
};

export const PdfSettings: React.FC<PdfSettingsProps> = ({ className, defaultValue }) => {
  const router = useRouter();
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes([
      { title: 'Réglages PDF', href: '/settings/pdf' },
      { title: TABS_CONFIG[defaultValue as TabKey].label }
    ]);
  }, [router.locale, defaultValue]);

  const handleTabChange = (value: string) => {
    router.push(`/settings/pdf/${value}`, undefined, { shallow: true });
  };

  if (!Object.keys(TABS_CONFIG).includes(defaultValue)) return <Page404 />;

  return (
    <div className={cn('overflow-auto p-8', className)}>
      <Tabs defaultValue={defaultValue} onValueChange={handleTabChange} className="overflow-auto">
        <TabsList className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 w-full h-fit">
          {Object.keys(TABS_CONFIG).map((key) => (
            <TabsTrigger key={key} value={key} className="flex gap-2 items-center">
              {TABS_CONFIG[key as TabKey].icon} {TABS_CONFIG[key as TabKey].label}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.keys(TABS_CONFIG).map((key) => (
          <TabsContent key={key} value={key}>
            {TABS_CONFIG[key as TabKey].component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
