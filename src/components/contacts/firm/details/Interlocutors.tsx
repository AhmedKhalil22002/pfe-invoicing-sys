import React from 'react';
import { InterlocutorMain } from '../../interlocutor/InterlocutorMain';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookUser } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface OverviewProps {
  className?: string;
  firmId: number;
  mainInterlocutorId?: number;
}

export const Interlocutors: React.FC<OverviewProps> = ({
  className,
  firmId,
  mainInterlocutorId
}) => {
  const { t } = useTranslation('contacts');
  return (
    <div className={className}>
      <Card className={cn('border-0 shadow-none', className)}>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <BookUser className="h-6 w-6 mr-2" />
              {t('interlocutor.list')}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InterlocutorMain
            className="p-0"
            firmId={firmId}
            mainInterlocutorId={mainInterlocutorId}
          />
        </CardContent>
      </Card>
    </div>
  );
};
