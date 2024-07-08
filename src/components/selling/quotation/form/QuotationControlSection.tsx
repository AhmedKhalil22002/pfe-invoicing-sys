import { Firm } from '@/api';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Control, UseFormRegister, UseFormWatch } from 'react-hook-form';

interface QuotationControlSectionProps {
  className?: string;
  toggleInvoicingAddress: () => void;
  toggleDeliveryAddress: () => void;
  toggleTaxStamp: () => void;
  toggleGeneralConditions: () => void;
  //   register: UseFormRegister<CreateQuotationDto>;
  //   control: Control<CreateQuotationDto, any>;
  //   watch: UseFormWatch<CreateQuotationDto>;
  //   firms: Firm[];
  //   handleAddressChange: (firm: Firm) => void;
  loading?: boolean;
}

export const QuotationControlSection = ({
  className,
  toggleInvoicingAddress,
  toggleDeliveryAddress,
  toggleTaxStamp,
  toggleGeneralConditions
  //   register,
  //   control,
}: QuotationControlSectionProps) => {
  return (
    <div className={cn(className)}>
      <div className="border-b w-full">
        <h1 className="font-bold">Inclure Sur Le Devis</h1>
        <div className="flex w-full items-center mt-1">
          <Label className="w-full">Adresse de Facturation</Label>
          <div className="w-full mx-2 text-right">
            <Switch onClick={toggleInvoicingAddress} defaultChecked />
          </div>
        </div>

        <div className="flex w-full items-center mt-1">
          <Label className="w-full">Adresse de Livraison</Label>
          <div className="w-full mx-2 text-right">
            <Switch onClick={toggleDeliveryAddress} defaultChecked />
          </div>
        </div>

        <div className="flex w-full items-center mt-1">
          <Label className="w-full">Condition Général</Label>
          <div className="w-full mx-2 text-right">
            <Switch onClick={toggleGeneralConditions} defaultChecked />
          </div>
        </div>
      </div>
      <div className="border-b w-full mt-5">
        <h1 className="font-bold">Entrées Supplémentaires</h1>
        <div className="flex w-full items-center mt-1">
          <Label className="w-full">Timbre Fiscal</Label>
          <div className="w-full mx-2 text-right">
            <Switch onClick={toggleTaxStamp} />
          </div>
        </div>
      </div>
    </div>
  );
};
