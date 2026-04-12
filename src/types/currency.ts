import { DatabaseEntity } from './response/DatabaseEntity';

export interface Currency {
  id?: number;
  label: string;
  code: string;
  symbol?: string;
  digitAfterComma?: number;
}

export interface ResponseCurrencyDto extends DatabaseEntity {
  id: number;
  label: string;
  code: string;
  symbol?: string;
  digitAfterComma?: number;
}
