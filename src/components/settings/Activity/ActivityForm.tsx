import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity } from '@/api';

interface ActivityFormProps {
  className?: string;
  activity: Activity | null;
  onActivityChange: (activity: Activity) => void;
}

export const ActivityForm = ({ className, activity, onActivityChange }: ActivityFormProps) => {
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
            activity &&
              onActivityChange({
                ...activity,
                [e.target.name]: e.target.value || ''
              });
          }}
        />
      </div>
    </div>
  );
};
