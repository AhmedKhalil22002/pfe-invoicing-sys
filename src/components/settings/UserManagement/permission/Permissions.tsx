import { DataTable } from './data-table/data-table';
import { getPermissionColumns } from './data-table/columns';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { PermissionActionsContext } from './data-table/action-context';
import { useBreadcrumb } from '@/components/layout/BreadcrumbContext';
import { useDebounce } from '@/hooks/other/useDebounce';
import ContentSection from '@/components/common/ContentSection';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

export default function Permissions() {
  //next-router
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes([
      { title: tCommon('menu.settings') },
      { title: tCommon('submenu.user_management') },
      { title: tCommon('settings.user_management.permissions') }
    ]);
  }, [router.locale]);

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const [sortDetails, setSortDetails] = React.useState({
    order: true,
    sortKey: 'id'
  });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const {
    data: permissionsResponse,
    isPending: isPermissionsPending
    // refetch: refetchPermissions,
  } = useQuery({
    queryKey: [
      'permissions',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.permission.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm
      )
  });

  const permissions = React.useMemo(() => {
    if (!permissionsResponse) return [];
    return permissionsResponse.data;
  }, [permissionsResponse]);

  const context = {
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: permissionsResponse?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey })
  };

  const isPending = isPermissionsPending || paging || resizing || searching || sorting;
  return (
    <ContentSection
      title="Permissions"
      desc="Set and manage permissions to control access to features and resources securely and efficiently."
      className="w-full">
      <div className="w-full">
        <PermissionActionsContext.Provider value={context}>
          <DataTable
            className="my-2"
            columns={getPermissionColumns()}
            data={permissions}
            isPending={isPending}
          />
        </PermissionActionsContext.Provider>
      </div>
    </ContentSection>
  );
}
