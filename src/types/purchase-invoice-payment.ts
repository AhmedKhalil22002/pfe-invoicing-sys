import { DatabaseEntity } from './response/DatabaseEntity';
import { PurchaseInvoice } from './purchase-invoice';
import { Payment } from './payment';

export interface PaymentPurchaseInvoiceEntry extends DatabaseEntity {
  id?: number;
  purchaseInvoiceId?: number;
  purchaseInvoice?: PurchaseInvoice;
  paymentId?: number;
  payment?: Payment;
  amount?: number;
}
