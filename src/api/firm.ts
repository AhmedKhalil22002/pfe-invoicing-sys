import axios from './axios';
import { PagedResponse } from './response';
import { Firm } from './types/firm';

export type CreateFirmDto = Omit<Firm, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type PagedFirm = PagedResponse<Firm>;

const TEST_CABINET =
  typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_CABINET_ID : process.env.CABINET_ID;

const factory = (): Firm => {
  return {
    website: '',
    name: '',
    taxIdNumber: '',
    isPerson: false,
    invoicingAddress: {
      address: '',
      address2: '',
      region: '',
      zipcode: '',
      countryId: -1
    },
    deliveryAddress: {
      address: '',
      address2: '',
      region: '',
      zipcode: '',
      countryId: -1
    },
    cabinetId: +(TEST_CABINET || 1),
    activityId: -1,
    currencyId: -1,
    paymentConditionId: -1,
    mainInterlocutor: {
      title: '',
      name: '',
      surname: '',
      email: '',
      phone: ''
    },
    notes: ''
  };
};
const find = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = 'id',
  search: string = '',
  strict: boolean = false
): Promise<PagedFirm> => {
  const response = await axios.get<PagedFirm>(
    `public/firm/all?sort${sortKey}=${order}&filters${sortKey}=${search}&strictMatching${sortKey}=${strict}&pageOptions[page]=${page}&pageOptions[take]=${size}`
  );
  return response.data;
};

const create = async (firm: CreateFirmDto): Promise<Firm> => {
  const response = await axios.post<Firm>('public/firm', firm);
  return response.data;
};

export const firm = { find, create, factory };
