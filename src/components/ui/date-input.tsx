import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface DatePickerWithPresetsProps {
  className?: string;
  date?: Date | undefined;
  setDate?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  presets?: { label: string; days: number }[];
  buttonText?: string;
  dateFormat?: string;
}

export const DatePicker: React.FC<DatePickerWithPresetsProps> = ({
  className,
  date,
  setDate,
  presets = [
    { label: 'Today', days: 0 },
    { label: 'Tomorrow', days: 1 },
    { label: 'In 3 days', days: 3 },
    { label: 'In a week', days: 7 }
  ],
  buttonText = 'Choisissez une date',
  dateFormat = 'dd-MM-yyyy'
}) => {
  return (
    <div className={cn('w-full', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, dateFormat) : <span>{buttonText}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" className="flex w-auto flex-col space-y-2 p-2">
          <Select onValueChange={(value) => setDate?.(addDays(new Date(), parseInt(value)))}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              {presets.map((preset) => (
                <SelectItem key={preset.label} value={preset.days.toString()}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="rounded-md border">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
