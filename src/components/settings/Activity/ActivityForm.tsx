import { Activity } from '@/api/types/activity';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ActivityFormProps {
  className?: string;
  activity: Activity | null;
  onChange: Function;
}

export const ActivityForm = ({ className, activity, onChange }: ActivityFormProps) => {
  return (
    <div className={className}>
      <div className="mt-4">
        <Label>Titre(*)</Label>
        <Input
          className="mt-2"
          placeholder="Ex. Service"
          name="label"
          value={activity?.label}
          onChange={(e) => {
            onChange({
              ...activity,
              [e.target.name]: e.target.value || ''
            });
          }}
        />
      </div>
    </div>
  );
};
