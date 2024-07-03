import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NotepadText } from 'lucide-react';
import { CreateFirmDto } from '@/api';
import { UseFormRegister } from 'react-hook-form';

interface FirmNotesInformations {
  className?: string;
  placeholder?: string;
  register: UseFormRegister<CreateFirmDto>;
  loading?: boolean;
}

const FirmNotesInformations = ({
  className,
  placeholder = '',
  register,
  loading
}: FirmNotesInformations) => {
  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle className="border-b">
          <div className="flex items-center">
            <NotepadText className="h-5 w-5 mr-2" />
            <Label className="text-sm font-semibold">Remarques</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          isPending={loading || false}
          placeholder={placeholder}
          className="resize-none"
          {...register('notes')}
        />
      </CardContent>
    </Card>
  );
};

export default FirmNotesInformations;
