import React from 'react';
import { useBreadcrumb } from '@/components/layout/BreadcrumbContext';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/other/useDebounce';

interface InvoiceMainProps {
  className?: string;
  firmId?: number;
  interlocutorId?: number;
}

export const InvoiceMain: React.FC<InvoiceMainProps> = ({ className, firmId, interlocutorId }) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    if (!firmId && !interlocutorId)
      setRoutes([
        { title: tCommon('menu.selling'), href: '/selling' },
        { title: tCommon('submenu.invoices') }
      ]);
  }, [router.locale, firmId, interlocutorId]);

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const [sortDetails, setSortDetails] = React.useState({ order: true, sortKey: 'id' });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [duplicateDialog, setDuplicateDialog] = React.useState(false);
  const [downloadDialog, setDownloadDialog] = React.useState(false);

  return <div>Hello Invoice</div>;
};
