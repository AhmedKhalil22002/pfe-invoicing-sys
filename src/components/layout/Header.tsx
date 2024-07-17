import React from 'react';
import Link from 'next/link';
import { CircleUser, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import logo from 'src/assets/logo.png';
import { IMenuItem } from './interfaces/MenuItem.interface';
import { useRouter } from 'next/router';
import { LanguageSwitcher } from '../common';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

interface HeaderProps {
  className?: string;
  menuItems: IMenuItem[];
}

export const Header = ({ className, menuItems }: HeaderProps) => {
  const router = useRouter();
  const activeItem = menuItems.find((item) => router.asPath.includes(item.code));
  const pageTitle = menuItems.find((item) => router.pathname === item.href)?.title;

  return (
    <header
      className={cn(
        'flex h-14 items-center gap-2 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6',
        className
      )}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <Image src={logo} alt="logo" className="h-8 w-8" />
              <span>Invoicing System</span>
            </Link>
            <nav className="grid items-start mt-5 p-0 text-sm ">
              <Accordion type="single" collapsible defaultValue={activeItem?.id?.toString()}>
                {menuItems.map((item) => (
                  <AccordionItem
                    key={item.code}
                    value={item.id?.toString() || ''}
                    className="border-0">
                    <AccordionTrigger
                      className={cn(
                        'gap-2 rounded-lg -py-2',
                        item.code.includes(router.pathname)
                          ? 'text-muted-foreground text-primary bg-gray-100 font-semibold'
                          : 'bg-muted hover:font-semibold'
                      )}>
                      <div className="flex items-center gap-3 rounded-lg py-2">
                        {item.icon}
                        {item.title}
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
                              'flex items-center gap-2 rounded-lg pl-6 py-2 transition-all hover:bg-gray-100',
                              subItem.href === router.asPath
                                ? 'text-muted-foreground text-primary bg-gray-100 font-semibold'
                                : 'bg-muted hover:font-semibold'
                            )}>
                            {subItem.icon}
                            <span className="font-medium">{subItem.title}</span>
                          </Link>
                        ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </nav>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <h1 className="font-semibold">{pageTitle}</h1>
      </div>
      <div>
        <LanguageSwitcher className="mx-4" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
