import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

import { SlashIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface BreadcrumbCommonProps {
  className?: string;
  hierarchy?: { title: string; href?: string }[];
}

export const BreadcrumbCommon = ({ className, hierarchy }: BreadcrumbCommonProps) => {
  const { t } = useTranslation('common');
  return (
    <Breadcrumb className={cn(className, 'mt-2 mb-6 mx-2')}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="font-semibold -mx-2" href="/">
            {t('menu.dashboard')}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {hierarchy?.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink className="font-semibold -mx-2" href={item.href}>
                  {item.title}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="font-extrabold -mx-2">{item.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
