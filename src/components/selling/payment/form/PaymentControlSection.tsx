import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

interface PaymentControlSectionProps {
  className?: string;
  isDataAltered?: boolean;
  handleSubmit?: () => void;
  reset: () => void;
  loading?: boolean;
}

export const PaymentControlSection = ({
  className,
  isDataAltered,
  handleSubmit,
  reset,
  loading
}: PaymentControlSectionProps) => {
  const router = useRouter();
  return (
    <div className={className}>
      <div className="flex flex-col gap-5">
        <Button className="flex items-center" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
};
