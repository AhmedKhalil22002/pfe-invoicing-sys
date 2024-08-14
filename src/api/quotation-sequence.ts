import { appConfig } from './app-config';
import { QuotationSequentialNumber } from './types/quotation-sequence';

export interface UpdateQuotationSequentialNumberDto
  extends Omit<
    QuotationSequentialNumber,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleteRestricted'
  > {
  id: number;
}

const find = async (): Promise<QuotationSequentialNumber[]> => {
  return await appConfig.find(['quotation-sequence']);
};

const update = async (
  updateQuotationSequentialNumberDto: UpdateQuotationSequentialNumberDto
): Promise<QuotationSequentialNumber> => {
  return await appConfig.update(updateQuotationSequentialNumberDto);
};

export const quotationSequence = { find, update };
