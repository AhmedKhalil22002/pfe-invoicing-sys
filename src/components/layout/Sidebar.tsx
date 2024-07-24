import React from 'react';
import Link from 'next/link';
import logo from 'src/assets/logo.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { IMenuItem } from '@/components/layout/interfaces/MenuItem.interface';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  menuItems: IMenuItem[];
}

export const Sidebar = ({ menuItems }: SidebarProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const activeItem = menuItems.find((item) => router.asPath.includes(item.code));

  return (
    <div className="hidden border-r bg-muted/40 md:block w-1/4 lg:w-1/5 xl:w-2/12 bg-white dark:bg-slate-950">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold cursor-pointer">
            <Image src={logo} alt="logo" className="h-8 w-8" />
            <span className="uppercase">ZC-Invoice</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-1 text-sm lg:px-3">
            <Accordion type="single" collapsible defaultValue={activeItem?.id?.toString()}>
              {menuItems.map((item) => (
                <AccordionItem
                  key={item.code}
                  value={item.id?.toString() || ''}
                  className="border-0">
                  <AccordionTrigger
                    className={cn(
                      'gap-2 rounded-lg px-3 -py-2',
                      item.code.includes(router.pathname)
                        ? 'text-muted-foreground text-primary bg-gray-100 dark font-semibold'
                        : 'bg-muted hover:font-semibold'
                    )}>
                    <div className="flex items-center gap-3 rounded-lg py-2">
                      {item.icon}
                      {t(`menu.${item.code}`)}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="-mb-4">
                    {item.subMenu &&
                      item.subMenu.map((subItem: IMenuItem) => (
                        <Link
                          key={subItem.code}
                          href={subItem.href || '/'}
                          passHref
                          className={cn(
                            'flex items-center gap-2 rounded-lg pl-6 py-2 transition-all hover:bg-gray-100 hover:dark:bg-slate-800',
                            subItem.href === router.asPath
                              ? 'text-muted-foreground text-primary bg-gray-100 dark:bg-slate-800 font-semibold'
                              : 'bg-muted hover:font-semibold'
                          )}>
                          {subItem.icon}
                          <span className="font-medium">{t(`submenu.${subItem.code}`)}</span>
                        </Link>
                      ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </nav>
        </div>
      </div>
    </div>
  );
};
