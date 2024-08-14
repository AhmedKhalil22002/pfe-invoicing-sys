import { DATE_FORMAT } from '../enums/date-formats';
import { AppConfig } from './app-config';

export interface QuotationSequentialNumber
  extends AppConfig<{
    dynamic_sequence: DATE_FORMAT;
    next: number;
    prefix: string;
  }> {}
