'use client';
import React from 'react';
import { api } from '@/api';
import { Firm, firmColumns } from '@/api/types/firm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, ChevronUp, MoreHorizontal, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowShimmerBlock
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PaginationControls } from '@/components/common/PaginationControls';

export default function Contacts() {
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(5);
  const [order, setOrder] = React.useState(false);
  const [sortKey, setSortKey] = React.useState('name');
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
  console.log(visibleColumns);
  const [search, setSearch] = React.useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { value: debouncedSearchTerm, loading: searching } = useDebounce(search, 500);

  React.useEffect(() => {}, []);

  const {
    isPending: isFetchPending,
    error,
    data: firmsResp
  } = useQuery({
    queryKey: ['firms'],
    queryFn: () => api.firm.find()
  });

  const firms = React.useMemo(() => {
    if (!firmsResp) return [];
    return firmsResp.data;
  }, [firmsResp]);

  const dataBlock = React.useMemo(() => {
    return firms?.map((firm: Firm) => (
      <TableRow key={firm.id}>
        <TableCell className="font-medium" hidden={!visibleColumns['firmName']}>
          {firm.name}
        </TableCell>
        <TableCell className="font-medium" hidden={!visibleColumns['name']}>
          {firm.mainInterlocutor.name} {firm.mainInterlocutor.surname}
        </TableCell>
        <TableCell className="font-medium" hidden={!visibleColumns['phone']}>
          {firm.mainInterlocutor.phone}
        </TableCell>
        <TableCell className="font-medium" hidden={!visibleColumns['website']}>
          {firm.website}
        </TableCell>
        <TableCell className="font-medium" hidden={!visibleColumns['taxIdNumber']}>
          {firm.taxIdNumber}
        </TableCell>
        <TableCell className="font-medium" hidden={!visibleColumns['isPerson']}>
          <Badge className="px-4 py-1">{firm.isPerson ? 'Oui' : 'Non'}</Badge>
        </TableCell>
        <TableCell className="font-medium" hidden={!visibleColumns['activity']}>
          {firm.activity.label}
        </TableCell>
        <TableCell className="font-medium" hidden={!visibleColumns['currency']}>
          {firm.currency.label}
        </TableCell>
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

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <div className="relative flex-1 md:grow-0 text-start">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  className="w-96 rounded-lg bg-background pl-8"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="w-full flex items-center justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="mx-5">
                      Affichage des colonnes
                      <ChevronDown className='h-5 w-5 ml-2'/>
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
            {isFetchPending ? (
              <TableBody className="mt-2">
                {/* TableShimmer */}
                <TableRowShimmerBlock
                  className="w-full h-16"
                  count={5}
                  isPending={isFetchPending}
                />
              </TableBody>
            ) : firms.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-center" colSpan={4}>
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
    </>
  );
}
