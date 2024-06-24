import React from 'react';
import { api } from '@/api';
import { firmColumns } from '@/api/types/firm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
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

export default function Contacts() {
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

  React.useEffect(() => {
    api.firm.find().then(console.log);
  }, []);

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
                    <Button className="mx-5">Affichage des colonnes</Button>
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
                <TableHead className="w-2/12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {false ? (
              <TableBody className="mt-2">
                {/* TableShimmer */}
                <TableRowShimmerBlock className="w-full h-16" count={1} isPending={false} />
              </TableBody>
            ) : false ? (
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-center" colSpan={4}>
                    Aucune Firme trouvée
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>{/* {dataBlock} */}</TableBody>
            )}
          </Table>
        </CardContent>
        <CardFooter className="border-t px-6 py-4"></CardFooter>
      </Card>
    </>
  );
}
