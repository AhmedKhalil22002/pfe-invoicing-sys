import React from 'react';
import {
  Pagination,
  PaginationContent,
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
  fetchCallback?: Function;
}

export const PaginationControls = ({
  className,
  hasNextPage,
  hasPreviousPage,
  page,
  pageCount,
  fetchCallback
}: PaginationControlsProps) => {
  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (hasPreviousPage) fetchCallback?.(page - 1);
            }}
          />
        </PaginationItem>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              onClick={async () => await fetchCallback?.(p)}
              className={p === page ? 'active' : ''}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={async () => {
              if (hasNextPage) await fetchCallback?.(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
