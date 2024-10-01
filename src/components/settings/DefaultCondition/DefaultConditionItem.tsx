import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface DefaultConditionItemProps {
  className?: string;
  title: string;
  value: string;
  onChange: (value: any) => void;
  loading?: boolean;
}
export const DefaultConditionItem: React.FC<DefaultConditionItemProps> = ({
  className,
  title,
  value,
  onChange,
  loading
}) => {
  const { t: tSettings } = useTranslation('settings');
  return (
    <Card className={cn('border-none', className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          rows={10}
          className="resize-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          isPending={loading}
        />
        <div className="flex justify-center gap-2 mt-5">
          <Checkbox />
          <Label className="leading-5 font-bold">
            {tSettings('default_condition.update_sentance', { document_type: title.toLowerCase() })}
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};
