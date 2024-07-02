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
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              onClick={() => fetchCallback?.(p)}
              className={p === page ? 'bg-slate-100' : ''}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
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
