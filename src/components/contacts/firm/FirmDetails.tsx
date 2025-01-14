import React from 'react';
import { cn } from '@/lib/utils';
import { Info, Hourglass, File, FileText, Wallet, Users } from 'lucide-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';
import SidebarNav from '@/components/sidebar-nav';
import useFirm from '@/hooks/content/useFirm';
import { Spinner } from '@/components/common';
import { PageHeader } from '@/components/common/PageHeader';

interface FirmDetailsProps {
  className?: string;
  firmId: string;
  children?: React.ReactNode;
}

export const FirmDetails: React.FC<FirmDetailsProps> = ({ className, firmId, children }) => {
  //next-router
  const router = useRouter();

  //translations
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');

  const { firm, isFetchFirmPending } = useFirm(parseInt(firmId));

  //menu items
  const sidebarNavItems = [
    {
      title: tContacts('firm.detailmenu.overview'),
      icon: <Info size={18} />,
      href: `/contacts/firm/${firmId}/overview`
    },
    {
      title: tContacts('firm.detailmenu.interlocutors'),
      icon: <Users size={18} />,
      href: `/contacts/firm/${firmId}/interlocutors`
    },
    {
      title: tContacts('firm.detailmenu.quotations'),
      icon: <File size={18} />,
      href: `/contacts/firm/${firmId}/quotations`
    },
    {
      title: tContacts('firm.detailmenu.invoices'),
      icon: <FileText size={18} />,
      href: `/contacts/firm/${firmId}/invoices`
    },
    {
      title: tContacts('firm.detailmenu.payments'),
      icon: <Wallet size={18} />,
      href: `/contacts/firm/${firmId}/payments`
    },
    {
      title: tContacts('firm.detailmenu.chronological'),
      icon: <Hourglass size={18} />,
      href: `/contacts/firm/${firmId}/chronological`
    }
  ];

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden m-5 lg:mx-10', className)}>
      <PageHeader
        title={tContacts('firm.detailmenu.title', { firmName: firm?.name })}
        description={tContacts('firm.detailmenu.description', { firmName: firm?.name })}
      />
      <div className="flex flex-col flex-1 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 mt-2">
        <aside className="flex-1 mb-2">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex flex-col flex-[7] overflow-hidden">
          {!isFetchFirmPending ? (
            children
          ) : (
            <Spinner className="h-screen" show={isFetchFirmPending} />
          )}
        </div>
      </div>
    </div>
  );
};
