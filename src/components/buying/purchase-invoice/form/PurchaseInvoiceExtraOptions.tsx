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
import { usePurchaseInvoiceManager } from '../hooks/usePurchaseInvoiceManager';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import React from 'react';

interface PurchaseInvoiceExtraOptionsProps {
  className?: string;
  loading?: boolean;
}

export const PurchaseInvoiceExtraOptions = ({ className, loading }: PurchaseInvoiceExtraOptionsProps) => {
  const { t: tInvoicing } = useTranslation('invoicing');
  const purchaseInvoiceManager = usePurchaseInvoiceManager();

  const handleFilesChange = (files: File[]) => {
    if (files.length > purchaseInvoiceManager.uploadedFiles.length) {
      const newFiles = files.filter(
        (file) => !purchaseInvoiceManager.uploadedFiles.some((uploadedFile) => uploadedFile.file === file)
      );
      purchaseInvoiceManager.set('uploadedFiles', [
        ...purchaseInvoiceManager.uploadedFiles,
        ...newFiles.map((file) => ({ file }))
      ]);
    } else {
      const updatedFiles = purchaseInvoiceManager.uploadedFiles.filter((uploadedFile) =>
        files.some((file) => file === uploadedFile.file)
      );
      purchaseInvoiceManager.set('uploadedFiles', updatedFiles);
    }
  };

  return (
    <Accordion type="multiple" className={cn(className, 'mx-1 border-b')}>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex gap-2 justify-center items-center">
            <Files />
            <Label>{tInvoicing('purchaseInvoice.attributes.files')}</Label>
          </div>
        </AccordionTrigger>
        <AccordionContent className="m-5">
          <FileUploader
            accept={{
              'image/*': [],
              'application/pdf': [],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
              'application/msword': [],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
              'application/vnd.ms-excel': []
            }}
            className="my-5"
            maxFileCount={Infinity}
            value={purchaseInvoiceManager.uploadedFiles?.map((d) => d.file)}
            onValueChange={handleFilesChange}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          <div className="flex gap-2 justify-center items-center">
            <NotebookTabs />
            <Label>{tInvoicing('purchaseInvoice.attributes.notes')}</Label>
          </div>
        </AccordionTrigger>
        <AccordionContent className="m-5">
          <Textarea
            placeholder={tInvoicing('purchaseInvoice.attributes.notes')}
            className="resize-none"
            value={purchaseInvoiceManager.notes}
            onChange={(e) => purchaseInvoiceManager.set('notes', e.target.value)}
            isPending={loading}
            rows={7}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
