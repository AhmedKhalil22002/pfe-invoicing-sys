import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NotepadText } from 'lucide-react';
import React from 'react';

interface FirmNotesInformations {
  className?: string;
  placeholder?: string;
}

export const FirmNotesInformations: React.FC<FirmNotesInformations> = ({
  className,
  placeholder = '',
}) => {
  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle  className='border-b'>
          <div className="flex items-center">
            <NotepadText className="h-5 w-5 mr-2" />
            <Label className="text-sm font-semibold">Remarques</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea placeholder={placeholder} className="resize-none" />
      </CardContent>
    </Card>
  );
};
