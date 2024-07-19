import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination';

interface PaginationControlsProps {
  className?: string;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  page: number;
  pageCount: number;
  fetchCallback?: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  className,
  hasNextPage,
  hasPreviousPage,
  page,
  pageCount,
  fetchCallback
}) => {
  const renderPaginationItems = () => {
    const pages = [];
    const ellipsisThreshold = 2;

    if (pageCount <= 5) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => fetchCallback?.(i)}
              className={i === page ? 'bg-slate-100' : ''}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => fetchCallback?.(1)}
            className={1 === page ? 'bg-slate-100' : ''}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (page > ellipsisThreshold + 1) {
        pages.push(
          <PaginationItem key="ellipsis-prev">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      const startPage = Math.max(2, page - ellipsisThreshold);
      const endPage = Math.min(pageCount - 1, page + ellipsisThreshold);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => fetchCallback?.(i)}
              className={i === page ? 'bg-slate-100' : ''}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      if (page < pageCount - ellipsisThreshold) {
        pages.push(
          <PaginationItem key="ellipsis-next">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={pageCount}>
          <PaginationLink
            onClick={() => fetchCallback?.(pageCount)}
            className={pageCount === page ? 'bg-slate-100' : ''}>
            {pageCount}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={
              !hasPreviousPage ? 'bg-inherit hover:bg-inherit text-inherit cursor-not-allowed' : ''
            }
            onClick={() => {
              if (hasPreviousPage) fetchCallback?.(page - 1);
            }}
          />
        </PaginationItem>
        {renderPaginationItems()}
        <PaginationItem>
          <PaginationNext
            className={
              !hasNextPage ? 'bg-inherit hover:bg-inherit text-inherit cursor-not-allowed' : ''
            }
            onClick={() => {
              if (hasNextPage) fetchCallback?.(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
