import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuotationMain } from '@/components/selling/quotation/QuotationMain';

interface OverviewProps {
  className?: string;
  firmId: number;
}

export const Quotations: React.FC<OverviewProps> = ({ className, firmId }) => {
  return (
    <div className="p-8">
      <Card className={cn('border-0 shadow-none', className)}>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <File className="h-6 w-6 mr-2" />
              Liste des Devis
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuotationMain className="p-0" firmId={+firmId} />
        </CardContent>
      </Card>
    </div>
  );
};
