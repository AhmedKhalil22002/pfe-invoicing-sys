import React from 'react';
import { InterlocutorMain } from '../../interlocutor/InterlocutorMain';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookUser } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OverviewProps {
  className?: string;
  firmId: number;
}

export const Overview: React.FC<OverviewProps> = ({ className, firmId }) => {
  return (
    <div className="p-8">
      <Card className={cn('border-0 shadow-none', className)}>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <BookUser className="h-6 w-6 mr-2" />
              Liste des Interlocuteurs
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InterlocutorMain className="p-0" firmId={firmId} />
        </CardContent>
      </Card>
    </div>
  );
};
