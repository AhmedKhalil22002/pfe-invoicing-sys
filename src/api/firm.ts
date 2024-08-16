import { isUSTaxIdentificationNumber } from '@/utils/validations/string.validations';
import { AddressType, address } from './address';
import axios from './axios';
import { interlocutor } from './interlocutor';
import { PagedResponse } from './response';
import { ToastValidation } from './types';
import { Firm } from './types/firm';
import { SOCIAL_TITLE } from './enums';

export interface CreateFirmDto
  extends Omit<
    Firm,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleteRestricted' | 'interlocutorsToFirm'
  > {
  mainInterlocutor: {
    title: SOCIAL_TITLE;
    name: string;
    surname: string;
    email: string;
    phone: string;
    position: string;
  };
}
export interface UpdateFirmDto extends CreateFirmDto {
  id: number;
}

export type FirmQueryKeyParams = { [P in keyof Firm]?: boolean };

export interface PagedFirm extends PagedResponse<Firm> {}

const TEST_CABINET =
  typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_CABINET_ID : process.env.CABINET_ID;

const factory = (): CreateFirmDto => {
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
      title: SOCIAL_TITLE.MR,
      name: '',
      surname: '',
      email: '',
      phone: '',
      position: ''
    },
    notes: ''
  };
};

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = 'id',
  searchKey: string = 'name',
  search: string = '',
  relations: string[] = ['interlocutorsToFirm', 'currency', 'activity']
): Promise<PagedFirm> => {
  const response = await axios.get<PagedFirm>(
    `public/firm/list?sort=${sortKey},${order}&filter=${searchKey}||$cont||${search}&limit=${size}&page=${page}&join=${relations.join(',')}`
  );
  return response.data;
};

const findChoices = async (
  relations: string[] = ['interlocutorsToFirm', 'currency', 'activity', 'paymentCondition']
): Promise<Partial<Firm>[]> => {
  const response = await axios.get<Partial<Firm>[]>(`public/firm/all?join=${relations.join(',')}`);
  return response.data;
};

const findOne = async (
  id: number,
  relations: string[] = ['interlocutorsToFirm', 'currency', 'activity', 'paymentCondition']
): Promise<Firm> => {
  const response = await axios.get<Firm>(`public/firm/${id}?join=${relations.join(',')}`);
  return response.data;
};

const create = async (firm: CreateFirmDto): Promise<Firm> => {
  const response = await axios.post<Firm>('public/firm', {
    ...firm,
    cabinetId: +(TEST_CABINET || 1)
  });
  return response.data;
};

const validate = (firm: CreateFirmDto | UpdateFirmDto): ToastValidation => {
  const interlocutorValidation = firm?.mainInterlocutor
    ? interlocutor.validate(firm?.mainInterlocutor)
    : undefined;
  if (interlocutorValidation?.message) return interlocutorValidation;

  if (!firm.name) return { message: 'firm.errors.empty_entreprise_name' };
  if (!firm.taxIdNumber) return { message: "Numéro d'idnetification fiscale est obligatoire" };
  if (!firm.paymentConditionId)
    return { message: "La sélection d'une condition de paiement est obligatoire" };

  const invoicingAddressValidation = firm?.invoicingAddress
    ? address.validate(firm?.invoicingAddress)
    : undefined;
  if (invoicingAddressValidation?.message)
    return {
      ...invoicingAddressValidation,
      message: 'Adresse de Facturation : ' + invoicingAddressValidation?.message
    };

  const deliveryAddressValidation = firm?.deliveryAddress
    ? address.validate(firm?.deliveryAddress)
    : undefined;
  if (deliveryAddressValidation?.message)
    return {
      ...deliveryAddressValidation,
      message: 'Adresse de Livraison : ' + deliveryAddressValidation?.message
    };

  return { message: '' };
};

const update = async (firm: UpdateFirmDto): Promise<Firm> => {
  const response = await axios.put<Firm>(`public/firm/${firm.id}`, firm);
  return response.data;
};

const remove = async (id: number) => {
  const { data, status } = await axios.delete<Firm>(`public/firm/${id}`);
  return { data, status };
};

export const firm = {
  findPaginated,
  findOne,
  findChoices,
  create,
  factory,
  update,
  remove,
  validate
};
