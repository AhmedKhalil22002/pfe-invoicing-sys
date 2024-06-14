import Link from 'next/link';
import logo from 'src/assets/logo.png';
import Image from 'next/image';
import { MenuItem } from './interfaces/MenuItem.interface';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';

interface SidebarProps {
  menuItems: MenuItem[];
}

export const Sidebar = ({ menuItems }: SidebarProps) => {
  const router = useRouter();
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold cursor-pointer">
            <Image src={logo} alt="logo" className="h-8 w-8" />
            <span>ZC-Invoice</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm lg:px-4">
            {menuItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-100',
                  router.pathname.includes(item.code)
                    ? 'text-muted-foreground text-primary bg-gray-100 font-semibold'
                    : 'bg-muted hover:font-semibold'
                )}>
                {item.icon}
                {item.title}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
