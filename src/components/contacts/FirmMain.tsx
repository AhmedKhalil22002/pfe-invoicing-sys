import { api } from '@/api';
import { Firm, firmColumns } from '@/api/types/firm';
import { useDebounce } from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowShimmerBlock
} from '../ui/table';
import { FirmCells } from './FirmCells';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp, FolderInput, MoreHorizontal, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Checkbox } from '../ui/checkbox';
import { PaginationControls } from '../common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';

interface FirmMainProps {
  className?: string;
}

export const FirmMain: React.FC<FirmMainProps> = ({ className }) => {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);
  const [order, setOrder] = React.useState(true);
  const { value: debouncedOrder, loading: ordering } = useDebounce<boolean>(order, 500);
  const [search, setSearch] = React.useState('');
  const { value: debouncedSearch, loading: searching } = useDebounce<string>(search, 500);
  const [sortKey, setSortKey] = React.useState('[name]');
  const { value: debouncedSortKey, loading: sorting } = useDebounce<string>(sortKey, 500);

  const [visibleColumns, setVisibleColumns] = React.useState(
    firmColumns
      .map((col) => {
        return { [col.key]: col.default ? true : false };
      })
      .reduce((acc, current) => {
        const key = Object.keys(current)[0];
        acc[key] = current[key];
        return acc;
      }, {})
  );
  const {
    isPending: isFetchPending,
    error,
    data: firmsResp
  } = useQuery({
    queryKey: ['firms', debouncedPage, debouncedSize, debouncedOrder, debouncedSortKey, debouncedSearch],
    queryFn: () => api.firm.find(debouncedPage, debouncedSize, debouncedOrder ? 'ASC' : 'DESC', debouncedSortKey, debouncedSearch)
  });

  const firms = React.useMemo(() => {
    if (!firmsResp) return [];
    return firmsResp.data;
  }, [firmsResp]);

  const dataBlock = React.useMemo(() => {
    return firms?.map((firm: Firm) => (
      <TableRow key={firm.id}>
        <FirmCells visibleColumns={visibleColumns} firm={firm} />
        <TableCell className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Modifier</DropdownMenuItem>
              <DropdownMenuItem>Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [firms, visibleColumns]);


  const loading =
  isFetchPending ||
  paging ||
  resizing ||
  ordering ||
  searching ||
  sorting;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <div className={cn('w-full', className)}>
      <Card className="w-full">
        <CardContent className="p-5">
          <Button className="mx-2" onClick={() => router.push('/contacts/new-firm')}>
            Nouveau Client
            <Plus className="h-4 w-4 ml-2" />
          </Button>
          <Button className="mx-2">
            Import
            <FolderInput className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
      <Card className="w-full mt-5">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <div className="relative flex-1 md:grow-0 text-start">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  className="w-96 rounded-lg bg-background pl-8"
                  onChange={(e) => {
                    setSortKey('[name]');
                    setSearch(e.target.value);
                  }}
                />
              </div>
              <div className="w-full flex items-center justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="mx-5">
                      Affichage des colonnes
                      <ChevronDown className="h-5 w-5 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="mt-1 mr-5">
                    <div className="grid gap-1">
                      {firmColumns.map((col) => {
                        return (
                          <div key={col.key} className="flex gap-2 items-center">
                            <Checkbox
                              value={col.key}
                              checked={visibleColumns[col.key]}
                              onCheckedChange={(e) => {
                                setVisibleColumns({ ...visibleColumns, [col.key]: e === true });
                              }}
                            />
                            <span className="text-sm font-medium">{col.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {firmColumns.map((col) => {
                  return (
                    <TableHead
                      hidden={visibleColumns[col.key] === false}
                      key={col.key}
                      onClick={() => {
                        setSortKey(col.key);
                        setOrder(!order);
                      }}>
                      <div className="flex items-center cursor-pointer w-fit">
                        {col.name}
                        {order && sortKey === col.key ? (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
                <TableHead className="w-full flex items-center ">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {loading ? (
              <TableBody className="mt-2">
                {/* TableShimmer */}
                <TableRowShimmerBlock
                  className="w-full h-16"
                  count={5}
                  isPending={loading}
                />
              </TableBody>
            ) : firms.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell
                    className="font-medium text-center"
                    colSpan={
                      Object.values(visibleColumns).reduce(
                        (count, value) => count + (value ? 1 : 0),
                        0
                      ) + 1
                    }>
                    Aucune Firme trouvée
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>{dataBlock}</TableBody>
            )}
          </Table>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center w-full">
            <Label className="font-semibold text-sm mx-2">Afficher :</Label>
            <Select
              onValueChange={(value) => {
                setPage(1);
                setSize(+value);
              }}>
              <SelectTrigger className="w-1/6">
                <SelectValue placeholder={size} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
              </SelectContent>
            </Select>
            <Label className="font-semibold text-sm mx-2">éléments</Label>
          </div>

          <PaginationControls
            className="justify-end"
            hasNextPage={firmsResp?.meta.hasNextPage}
            hasPreviousPage={firmsResp?.meta.hasPreviousPage}
            page={page}
            pageCount={firmsResp?.meta.pageCount || 1}
            fetchCallback={(page: number) => setPage(page)}
          />
        </CardFooter>
      </Card>
    </div>
  );
};
