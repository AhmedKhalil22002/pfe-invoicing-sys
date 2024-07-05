export type PagedResponse<T> = {
  data: T[];
  meta: { itemCount: number; pageCount: number; hasPreviousPage: boolean; hasNextPage: boolean };
};

// export type QueryResponse<T> = {
//   columns?: { [P in keyof T]?: boolean };
//   relationSelect?: boolean;
//   filters?: Partial<T>;
//   sort?: { [P in keyof T]?: 'ASC' | 'DESC' };
//   pageOptions?: PagedResponse<T>;
// };
