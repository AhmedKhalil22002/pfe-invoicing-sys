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
import { useRouter } from 'next/router';

interface BreadcrumbCommonProps {
  className?: string;
  hierarchy?: { title: string; href?: string }[];
}

export const BreadcrumbCommon = ({ className, hierarchy }: BreadcrumbCommonProps) => {
  const router = useRouter();
  const lastIndex = hierarchy ? hierarchy.length - 1 : 0;
  return (
    <Breadcrumb className={cn(className, 'my-auto')}>
      <BreadcrumbList>
        {hierarchy?.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink
                  className={cn(
                    'font-semibold text-xs xl:text-base -mr-2',
                    item.href ? 'cursor-pointer' : 'cursor-default'
                  )}
                  onClick={() => {
                    item.href && router.push(item.href);
                  }}>
                  {item.title}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="font-extrabold text-xs xl:text-base -mx-2">
                  {item.title}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index != lastIndex && <SlashIcon className="h-5 w-5" />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
