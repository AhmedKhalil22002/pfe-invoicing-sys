import { Lock, PackageCheck, Users } from 'lucide-react';
import { Separator } from '../ui/separator';
import SidebarNav from '../sidebar-nav';
import { cn } from '@/lib/utils';

interface UserManagementProps {
  className?: string;
  children?: React.ReactNode;
}

export default function UserManagement({ className, children }: UserManagementProps) {
  return (
    <div className={cn('flex-1 flex flex-col overflow-hidden', className)}>
      <div className="space-y-0.5 py-5 sm:py-0">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts, roles, and permissions effortlessly to ensure secure and efficient
          access control.
        </p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex-1 flex flex-col overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 ">
        <aside className="flex-1">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-[6] px-2 space-y-4 overflow-auto overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}

const sidebarNavItems = [
  {
    title: 'Users',
    icon: <Users size={18} />,
    href: '/user-management/users'
  },
  {
    title: 'Roles',
    icon: <PackageCheck size={18} />,
    href: '/user-management/roles'
  },
  {
    title: 'Permissions',
    icon: <Lock size={18} />,
    href: '/user-management/permissions'
  }
];
