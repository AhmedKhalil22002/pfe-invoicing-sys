import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { FileUploader } from '@/components/ui/file-uploader';
import { Textarea } from '@/components/ui/textarea';
import { Files, NotebookTabs } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuotationManager } from '../hooks/useQuotationManager';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface QuotationExtraOptionsProps {
  className?: string;
  loading?: boolean;
}

export const QuotationExtraOptions = ({ className, loading }: QuotationExtraOptionsProps) => {
  const { t: tInvoicing } = useTranslation('invoicing');
  const quotationManager = useQuotationManager();

  return (
    <Accordion type="multiple" className={cn(className, 'mx-1')}>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex gap-2 justify-center items-center">
            <Files />
            <Label>Pièces Jointes</Label>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <FileUploader
            className="mt-5"
            maxFileCount={Infinity}
            value={quotationManager.files}
            onUpload={async (files) => {
              quotationManager.set('files', files);
              return Promise.resolve();
            }}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          <div className="flex gap-2 justify-center items-center">
            <NotebookTabs />
            <Label>Remarques</Label>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Textarea
            placeholder={tInvoicing('quotation.attributes.notes')}
            className="resize-none"
            value={quotationManager.notes}
            onChange={(e) => quotationManager.set('notes', e.target.value)}
            isPending={loading}
            rows={7}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
