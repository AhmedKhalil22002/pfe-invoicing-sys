import { api } from '@/api';
import { Spinner } from '@/components/common/Spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { Calculator } from 'lucide-react';
import React from 'react';

interface AccountingInformationsProps {
  className?: string;
}

export const AccountingInformations = ({ className }: AccountingInformationsProps) => {
  const { isPending: isFetchActivitiesPending, data: activitiesResp } = useQuery({
    queryKey: ['activitiesSelect'],
    queryFn: () => api.activity.find()
  });

  const activities = React.useMemo(() => {
    if (!activitiesResp) return [];
    return activitiesResp;
  }, [activitiesResp]);

  const { isPending: isFetchCurrecnciesPending, data: currenciesResp } = useQuery({
    queryKey: ['currencies'],
    queryFn: () => api.currency.find()
  });

  const currencies = React.useMemo(() => {
    if (!currenciesResp) return [];
    return currenciesResp;
  }, [currenciesResp]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center">
            <Calculator className="h-6 w-6 mr-2" />
            Informations Comptable
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-2 ml-2 w-full">
          <div className="flex justify-between">
            <div className="mt-2 mr-2 w-full">
              <Label>Numéro d&apos;identification Fiscale(*)</Label>
              <Input className="mt-2" placeholder="Ex. 1538414/L/A/M/0000" />
            </div>

            <div className="mt-2 mr-2 w-full">
              <Label>Activité</Label>
              <div className="mt-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Activité" />
                  </SelectTrigger>
                  <SelectContent>
                    {isFetchActivitiesPending ? (
                      <Spinner className="m-5" />
                    ) : (
                      activities.map((activity) => (
                        <SelectItem key={activity.id} value={activity.id.toString()}>
                          {activity.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-2 mr-2 w-full">
              <Label>Devise Principale</Label>
              <div className="mt-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Devise Principale" />
                  </SelectTrigger>
                  <SelectContent>
                  {isFetchCurrecnciesPending ? (
                      <Spinner className="m-5" />
                    ) : (
                      currencies.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id.toString()}>
                          {currency.label} ({currency.symbol})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
