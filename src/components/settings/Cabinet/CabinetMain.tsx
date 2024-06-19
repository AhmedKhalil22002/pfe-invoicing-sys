import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { GeneralInformations } from './GeneralInformations';

interface CabinetMainProps {
  className?: string;
}

const CabinetMain: React.FC<CabinetMainProps> = ({ className }) => {
  return (
    <div className={className}>
      <GeneralInformations className="mt-5" />
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <Calculator className="h-6 w-6 mr-2" />
              Informations Comptable
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
            
        </CardContent>
      </Card>
    </div>
  );
};

export default CabinetMain;
