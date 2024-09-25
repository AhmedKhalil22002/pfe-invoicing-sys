export type PagedResponse<T> = {
  data: T[];
  meta: { itemCount: number; pageCount: number; hasPreviousPage: boolean; hasNextPage: boolean };
};
