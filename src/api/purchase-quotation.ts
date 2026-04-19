import axios from './axios';
import { differenceInDays } from 'date-fns';
import { DISCOUNT_TYPE } from '../types/enums/discount-types';
import { upload } from './upload';
import { api } from '.';
import {
  ArticlePurchaseQuotationEntry,
  CreatePurchaseQuotationDto,
  DuplicatePurchaseQuotationDto,
  PagedPurchaseQuotation,
  PURCHASE_QUOTATION_STATUS,
  PurchaseQuotation,
  PurchaseQuotationUploadedFile,
  UpdatePurchaseQuotationDto
} from '@/types/purchase-quotation';
import { ToastValidation } from '@/types/toast-validation';
import { UpdateQuotationSequentialNumber } from '@/types/sequence';
import { PURCHASE_QUOTATION_FILTER_ATTRIBUTES } from '@/constants/purchase-quotation.filter-attributes';

const factory = (): CreatePurchaseQuotationDto => {
  return {
    date: '',
    dueDate: '',
    status: PURCHASE_QUOTATION_STATUS.Draft,
    generalConditions: '',
    total: 0,
    subTotal: 0,
    discount: 0,
    discount_type: DISCOUNT_TYPE.AMOUNT,
    currencyId: 0,
    firmId: 0,
    interlocutorId: 0,
    notes: '',
    articlePurchaseQuotationEntries: [],
    purchaseQuotationMetaData: {
      showDeliveryAddress: true,
      showInvoiceAddress: true,
      hasBankingDetails: true,
      hasGeneralConditions: true,
      showArticleDescription: true,
      taxSummary: []
    },
    files: []
  };
};

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string,
  search: string = '',
  relations: string[] = ['firm', 'interlocutor'],
  firmId?: number,
  interlocutorId?: number
): Promise<PagedPurchaseQuotation> => {
  const generalFilter = search
    ? Object.values(PURCHASE_QUOTATION_FILTER_ATTRIBUTES)
        .map((key) => `${key}||$cont||${search}`)
        .join('||$or||')
    : '';
  const firmCondition = firmId ? `firmId||$eq||${firmId}` : '';
  const interlocutorCondition = interlocutorId ? `interlocutorId||$cont||${interlocutorId}` : '';
  const filters = [generalFilter, firmCondition, interlocutorCondition].filter(Boolean).join(',');

  const response = await axios.get<PagedPurchaseQuotation>(
    new String().concat(
      'public/purchase-quotation/list?',
      `sort=${sortKey},${order}&`,
      `filter=${filters}&`,
      `limit=${size}&page=${page}&`,
      `join=${relations.join(',')}`
    )
  );
  return response.data;
};

const findChoices = async (status: PURCHASE_QUOTATION_STATUS): Promise<PurchaseQuotation[]> => {
  const response = await axios.get<PurchaseQuotation[]>(
    `public/purchase-quotation/all?filter=status||$eq||${status}`
  );
  return response.data;
};

const findOne = async (
  id: number,
  relations: string[] = [
    'firm',
    'currency',
    'bankAccount',
    'interlocutor',
    'firm.currency',
    'purchaseQuotationMetaData',
    'uploads',
    'uploads.upload',
    'firm.deliveryAddress',
    'firm.invoicingAddress',
    'articlePurchaseQuotationEntries',
    'firm.interlocutorsToFirm',
    'articlePurchaseQuotationEntries.article',
    'articlePurchaseQuotationEntries.articlePurchaseQuotationEntryTaxes',
    'articlePurchaseQuotationEntries.articlePurchaseQuotationEntryTaxes.tax'
  ]
): Promise<PurchaseQuotation & { files: PurchaseQuotationUploadedFile[] }> => {
  const response = await axios.get<PurchaseQuotation>(`public/purchase-quotation/${id}?join=${relations.join(',')}`);
  return { ...response.data, files: await getPurchaseQuotationUploads(response.data) };
};

const uploadPurchaseQuotationFiles = async (files: File[]): Promise<number[]> => {
  return files && files?.length > 0 ? await upload.uploadFiles(files) : [];
};

const create = async (purchaseQuotation: CreatePurchaseQuotationDto, files: File[]): Promise<PurchaseQuotation> => {
  const uploadIds = await uploadPurchaseQuotationFiles(files);
  const response = await axios.post<PurchaseQuotation>('public/purchase-quotation', {
    ...purchaseQuotation,
    uploads: uploadIds.map((id) => {
      return { uploadId: id };
    })
  });
  return response.data;
};

const getPurchaseQuotationUploads = async (purchaseQuotation: PurchaseQuotation): Promise<PurchaseQuotationUploadedFile[]> => {
  if (!purchaseQuotation?.uploads) return [];

  const uploads = await Promise.all(
    purchaseQuotation.uploads.map(async (u) => {
      if (u?.upload?.slug) {
        const blob = await api.upload.fetchBlobBySlug(u.upload.slug);
        const filename = u.upload.filename || '';
        if (blob)
          return { upload: u, file: new File([blob], filename, { type: u.upload.mimetype }) };
      }
      return { upload: u, file: undefined };
    })
  );
  return uploads
    .filter((u) => !!u.file)
    .sort(
      (a, b) =>
        new Date(a.upload.createdAt ?? 0).getTime() - new Date(b.upload.createdAt ?? 0).getTime()
    ) as PurchaseQuotationUploadedFile[];
};

const download = async (id: number, template: string): Promise<any> => {
  const purchaseQuotation = await findOne(id, []);
  const response = await axios.get<string>(`public/purchase-quotation/${id}/download?template=${template}`, {
    responseType: 'blob'
  });
  const blob = new Blob([response.data], { type: response.headers['content-type'] });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${purchaseQuotation.sequential}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return response;
};

const duplicate = async (duplicatePurchaseQuotationDto: DuplicatePurchaseQuotationDto): Promise<PurchaseQuotation> => {
  const response = await axios.post<PurchaseQuotation>(
    '/public/purchase-quotation/duplicate',
    duplicatePurchaseQuotationDto
  );
  return response.data;
};

const update = async (purchaseQuotation: UpdatePurchaseQuotationDto, files: File[]): Promise<PurchaseQuotation> => {
  const uploadIds = await uploadPurchaseQuotationFiles(files);
  const response = await axios.put<PurchaseQuotation>(`public/purchase-quotation/${purchaseQuotation.id}`, {
    ...purchaseQuotation,
    uploads: [
      ...(purchaseQuotation.uploads || []),
      ...uploadIds.map((id) => {
        return { uploadId: id };
      })
    ]
  });
  return response.data;
};

const invoice = async (id?: number, createInvoice?: boolean): Promise<PurchaseQuotation> => {
  const response = await axios.put<PurchaseQuotation>(`public/purchase-quotation/invoice/${id}/${createInvoice}`);
  return response.data;
};

const remove = async (id: number): Promise<PurchaseQuotation> => {
  const response = await axios.delete<PurchaseQuotation>(`public/purchase-quotation/${id}`);
  return response.data;
};

const validate = (purchaseQuotation: Partial<PurchaseQuotation>): ToastValidation => {
  if (!purchaseQuotation.date) return { message: 'La date est obligatoire' };
  if (!purchaseQuotation.dueDate) return { message: "L'échéance est obligatoire" };
  if (!purchaseQuotation.object) return { message: "L'objet est obligatoire" };
  if (differenceInDays(new Date(purchaseQuotation.date), new Date(purchaseQuotation.dueDate)) >= 0)
    return { message: "L'échéance doit être supérieure à la date" };
  if (!purchaseQuotation.firmId || !purchaseQuotation.interlocutorId)
    return { message: 'Entreprise et interlocuteur sont obligatoire' };
  return { message: '' };
};

const updatePurchaseQuotationsSequentials = async (updatedSequenceDto: UpdateQuotationSequentialNumber) => {
  const response = await axios.put<PurchaseQuotation>(
    `/public/purchase-quotation/update-purchase-quotation-sequences`,
    updatedSequenceDto
  );
  return response.data;
};

export const purchaseQuotation = {
  factory,
  findPaginated,
  findOne,
  findChoices,
  create,
  download,
  invoice,
  duplicate,
  update,
  updatePurchaseQuotationsSequentials,
  remove,
  validate
};
