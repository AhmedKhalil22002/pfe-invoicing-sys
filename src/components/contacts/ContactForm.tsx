import React from 'react';
import { Activity } from '@/api/types/activity';
import { Firm } from '@/api/types/firm';
import { Package, ReceiptText } from 'lucide-react';
import { FirmGeneralInformations } from './firm/form/FirmGeneralInformations';
import { FirmProfessionalInformations } from './firm/form/FirmProfessionalInformations';
import { FirmAddressInformations } from './firm/form/FirmAddressInformations';
import useCurrency from '@/hooks/useCurrency';
import useActivity from '@/hooks/useActivity';
import useCountry from '@/hooks/useCountry';
import { FirmNotesInformations } from './firm/form/FirmNotesInformations';
import { Button } from '../ui/button';

interface FirmFormProps {
  className?: string;
  activity?: Activity | null;
  onFirmChange?: (firm: Firm) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FirmForm = ({ className, activity, onFirmChange }: FirmFormProps) => {
  const { activities, isFetchActivitiesPending } = useActivity();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { countries, isFetchCountriesPending } = useCountry();

  if (isFetchActivitiesPending || isFetchCurrenciesPending || isFetchCountriesPending) return null;

  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <FirmGeneralInformations />
        <FirmProfessionalInformations activities={activities} currencies={currencies} />
        <FirmAddressInformations
          icon={<ReceiptText className="h-5 w-5 mr-2" />}
          addressLabel1="Adresse de Facturation"
          addressLabel2="Adresse de Livraison"
          countries={countries}
        />
        <FirmAddressInformations
          icon={<Package className="h-5 w-5 mr-2" />}
          addressLabel1="Adresse de Livraison"
          addressLabel2="Adresse de Facturation"
          countries={countries}
        />
      </div>
      <FirmNotesInformations className="mt-5" />
      <div className="flex justify-end mt-5">
        <Button className="ml-3">Enregistrer</Button>
        <Button variant="secondary" className="border-2 ml-3">Annuler</Button>
      </div>
    </div>
  );
};
