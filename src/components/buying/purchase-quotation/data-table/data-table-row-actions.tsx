import { useRouter } from 'next/router';
import { PURCHASE_QUOTATION_STATUS, PurchaseQuotation } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Copy, Download, FileCheck, Settings2, Telescope, Trash2 } from 'lucide-react';
import { usePurchaseQuotationManager } from '../hooks/usePurchaseQuotationManager';
import { usePurchaseQuotationActions } from './ActionsContext';

interface DataTableRowActionsProps {
  row: Row<PurchaseQuotation>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const purchaseQuotation = row.original;
  const { t: tCommon } = useTranslation('common');
  const router = useRouter();
  const purchaseQuotationManager = usePurchaseQuotationManager();
  const { openDeleteDialog, openDownloadDialog, openDuplicateDialog, openInvoiceDialog } =
    usePurchaseQuotationActions();

  const targetPurchaseQuotation = () => {
    purchaseQuotationManager.set('id', purchaseQuotation?.id);
    purchaseQuotationManager.set('sequential', purchaseQuotation?.sequential);
    purchaseQuotationManager.set('status', purchaseQuotation?.status);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[160px]">
        <DropdownMenuLabel className="text-center">{tCommon('commands.actions')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Inspect */}
        <DropdownMenuItem onClick={() => router.push('/buying/quotation/' + purchaseQuotation.id)}>
          <Telescope className="h-5 w-5 mr-2" /> {tCommon('commands.inspect')}
        </DropdownMenuItem>
        {/* Print */}
        <DropdownMenuItem
          onClick={() => {
            targetPurchaseQuotation();
            openDownloadDialog?.();
          }}>
          <Download className="h-5 w-5 mr-2" /> {tCommon('commands.download')}
        </DropdownMenuItem>
        {/* Duplicate */}
        <DropdownMenuItem
          onClick={() => {
            targetPurchaseQuotation();
            openDuplicateDialog?.();
          }}>
          <Copy className="h-5 w-5 mr-2" /> {tCommon('commands.duplicate')}
        </DropdownMenuItem>
        {(purchaseQuotation.status == PURCHASE_QUOTATION_STATUS.Draft ||
          purchaseQuotation.status == PURCHASE_QUOTATION_STATUS.Validated ||
          purchaseQuotation.status == PURCHASE_QUOTATION_STATUS.Sent) && (
          <DropdownMenuItem
            onClick={() => router.push('/buying/purchase-quotation-portal/' + purchaseQuotation.id)}>
            <Settings2 className="h-5 w-5 mr-2" /> {tCommon('commands.modify')}
          </DropdownMenuItem>
        )}
        {(purchaseQuotation.status == PURCHASE_QUOTATION_STATUS.Accepted ||
          purchaseQuotation.status == PURCHASE_QUOTATION_STATUS.Invoiced) && (
          <DropdownMenuItem
            onClick={() => {
              targetPurchaseQuotation();
              openInvoiceDialog?.();
            }}>
            <FileCheck className="h-5 w-5 mr-2" /> {tCommon('commands.to_invoice')}
          </DropdownMenuItem>
        )}
        {purchaseQuotation.status != PURCHASE_QUOTATION_STATUS.Sent && (
          <DropdownMenuItem
            onClick={() => {
              targetPurchaseQuotation();
              openDeleteDialog?.();
            }}>
            <Trash2 className="h-5 w-5 mr-2" /> {tCommon('commands.delete')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
