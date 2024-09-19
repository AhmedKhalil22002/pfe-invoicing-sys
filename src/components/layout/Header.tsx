import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import logolight from 'src/assets/logo.png';
import logoDark from 'src/assets/logo-light.png';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { IMenuItem } from './interfaces/MenuItem.interface';
import { useRouter } from 'next/router';
import { LanguageSwitcher } from '../common';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { ModeToggle } from '../common/ModeToggle';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { Label } from '../ui/label';
import packageJson from 'package.json';
import { ResponsiveSidebar } from './ResponsiveSidebar';

interface HeaderProps {
  className?: string;
  menuItems: IMenuItem[];
}

export const Header = ({ className, menuItems }: HeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const pageTitle = menuItems.find((item) => router.pathname === item.href)?.title;
  return (
    <header
      className={cn(
        'flex h-14 items-center gap-2 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 bg-white dark:bg-slate-950',
        className
      )}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only"> Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <ResponsiveSidebar menuItems={menuItems} />
          {/* app version */}
          <div className="mt-auto">
            <Label>v{packageJson.version}</Label>
          </div>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <h1 className="font-semibold">{pageTitle}</h1>
      </div>
      <div className="flex justify-center items-center">
        <LanguageSwitcher className="mx-4" />
        <ModeToggle className="mx-2" />
      </div>
    </header>
  );
};
