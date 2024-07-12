import { isUSTaxIdentificationNumber } from '@/utils/validations/string.validations';
import { AddressType, address } from './address';
import axios from './axios';
import { interlocutor } from './interlocutor';
import { PagedResponse } from './response';
import { ToastValidation } from './types';
import { Firm } from './types/firm';
import { buildUrlWithParams } from './utils/buildUrlWithParams';

export type CreateFirmDto = Omit<Firm, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateFirmDto = Omit<Firm, 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type FirmQueryKeyParams = { [P in keyof Firm]?: boolean };
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
    `public/firm/list?sort${sortKey}=${order}&filters${sortKey}=${search}&strictMatching${sortKey}=${strict}&pageOptions[page]=${page}&pageOptions[take]=${size}&relationSelect=true`
  );
  return response.data;
};

const findChoices = async (columns?: FirmQueryKeyParams): Promise<Partial<Firm>[]> => {
  const baseUrl = 'public/firm/all?columns[id]=true';
  const params = { columns };

  const response = await axios.get<Partial<Firm>[]>(buildUrlWithParams(baseUrl, params));
  return response.data;
};

const findOne = async (id: number): Promise<Firm> => {
  const response = await axios.get<Firm>(
    `public/firm/${id}?columns[invoicingAddress]=true&columns[deliveryAddress]=true&columns[mainInterlocutor]=true`
  );
  return response.data;
};

const create = async (firm: CreateFirmDto): Promise<Firm> => {
  const response = await axios.post<Firm>('public/firm', firm);
  return response.data;
};

const validate = (firm: Partial<Firm>, oneAddress: AddressType = ''): ToastValidation => {
  const interlocutorValidation = firm?.mainInterlocutor
    ? interlocutor.validate(firm?.mainInterlocutor)
    : undefined;
  if (interlocutorValidation?.message) return interlocutorValidation;

  if (!firm.name) return { message: "Nom de de l'entreprise est obligatoire" };
  if (!firm.taxIdNumber) return { message: "Numéro d'idnetification fiscale est obligatoire" };
  if (!isUSTaxIdentificationNumber(firm.taxIdNumber))
    return { message: "Numéro d'idnetification fiscale doit avoir 9 ou plus chiffres" };
  if (!firm.paymentConditionId)
    return { message: "La sélection d'une condition de paiement est obligatoire" };

  if (oneAddress === '' || oneAddress == 'invoicingAddress') {
    const invoicingAddressValidation = firm?.invoicingAddress
      ? address.validate(firm?.invoicingAddress)
      : undefined;
    if (invoicingAddressValidation?.message)
      return {
        ...invoicingAddressValidation,
        message: 'Adresse de Facturation : ' + invoicingAddressValidation?.message
      };
  }
  if (oneAddress === '' || oneAddress == 'deliveryAddress') {
    const deliveryAddressValidation = firm?.deliveryAddress
      ? address.validate(firm?.deliveryAddress)
      : undefined;
    if (deliveryAddressValidation?.message)
      return {
        ...deliveryAddressValidation,
        message: 'Adresse de Livraison : ' + deliveryAddressValidation?.message
      };
  }
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

export const firm = { find, findOne, findChoices, create, factory, update, remove, validate };
