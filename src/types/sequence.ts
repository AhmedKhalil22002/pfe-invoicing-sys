import { DateFormat } from './enums';
import { DatabaseEntity } from './response/DatabaseEntity';

export enum Sequences {
  INVOICE = 'invoice',
  QUOTATION = 'quotation',
  PURCHASE_QUOTATION = 'purchase_quotation_sequence'
}

export interface ResponseSequenceDto extends DatabaseEntity {
  id: number;
  label: string;
  prefix: string;
  dateFormat: DateFormat;
  next: number;
}

export interface UpdateSequentialDto {
  prefix?: string;
  dateFormat?: DateFormat;
  next?: number;
}

export type UpdateQuotationSequentialNumber = UpdateSequentialDto;