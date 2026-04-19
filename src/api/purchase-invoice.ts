import axios from './axios';
import { differenceInDays, isAfter } from 'date-fns';
import { DISCOUNT_TYPE } from '../types/enums/discount-types';
import { upload } from './upload';
import { api } from '.';
import {
  CreatePurchaseInvoiceDto,
  DateRange,
  DuplicatePurchaseInvoiceDto,
  PURCHASE_INVOICE_STATUS,
  PurchaseInvoice,
  PurchaseInvoiceUploadedFile,
  PagedPurchaseInvoice,
  ResponsePurchaseInvoiceRangeDto,
  ToastValidation,
  UpdatePurchaseInvoiceDto,
  UpdatePurchaseInvoiceSequentialNumber
} from '@/types';
import { PURCHASE_INVOICE_FILTER_ATTRIBUTES } from '@/constants/purchase-invoice.filter-attributes';

const factory = (): CreatePurchaseInvoiceDto => {
  return {
    date: '',
    dueDate: '',
    status: PURCHASE_INVOICE_STATUS.Unpaid,
    generalConditions: '',
    total: 0,
    subTotal: 0,
    discount: 0,
    discount_type: DISCOUNT_TYPE.AMOUNT,
    currencyId: 0,
    firmId: 0,
    interlocutorId: 0,
    notes: '',
    articlePurchaseInvoiceEntries: [],
    purchaseInvoiceMetaData: {
      showDeliveryAddress: true,
      showPurchaseInvoiceAddress: true,
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
): Promise<PagedPurchaseInvoice> => {
  const generalFilter = search
    ? Object.values(PURCHASE_INVOICE_FILTER_ATTRIBUTES)
        .map((key) => `${key}||$cont||${search}`)
        .join('||$or||')
    : '';
  const firmCondition = firmId ? `firmId||$eq||${firmId}` : '';
  const interlocutorCondition = interlocutorId ? `interlocutorId||$cont||${interlocutorId}` : '';
  const filters = [generalFilter, firmCondition, interlocutorCondition].filter(Boolean).join(',');

  const response = await axios.get<PagedPurchaseInvoice>(
    new String().concat(
      'public/purchase-invoice/list?',
      `sort=${sortKey},${order}&`,
      `filter=${filters}&`,
      `limit=${size}&page=${page}&`,
      `join=${relations.join(',')}`
    )
  );
  return response.data;
};

const findOne = async (
  id: number,
  relations: string[] = [
    'firm',
    'currency',
    'bankAccount',
    'purchase-quotation',
    'interlocutor',
    'firm.currency',
    'purchaseInvoiceMetaData',
    'uploads',
    'uploads.upload',
    'taxWithholding',
    'firm.deliveryAddress',
    'firm.invoicingAddress',
    'articlePurchaseInvoiceEntries',
    'firm.interlocutorsToFirm',
    'articlePurchaseInvoiceEntries.article',
    'articlePurchaseInvoiceEntries.articlePurchaseInvoiceEntryTaxes',
    'articlePurchaseInvoiceEntries.articlePurchaseInvoiceEntryTaxes.tax'
  ]
): Promise<PurchaseInvoice & { files: PurchaseInvoiceUploadedFile[] }> => {
  const response = await axios.get<PurchaseInvoice>(`public/purchase-invoice/${id}?join=${relations.join(',')}`);
  return { ...response.data, files: await getPurchaseInvoiceUploads(response.data) };
};

const findByRange = async (id?: number): Promise<ResponsePurchaseInvoiceRangeDto> => {
  const response = await axios.get<ResponsePurchaseInvoiceRangeDto>(
    `public/purchase-invoice/sequential-range/${id}`
  );
  return response.data;
};

const uploadPurchaseInvoiceFiles = async (files: File[]): Promise<number[]> => {
  return files && files?.length > 0 ? await upload.uploadFiles(files) : [];
};

const create = async (purchaseInvoice: CreatePurchaseInvoiceDto, files: File[]): Promise<PurchaseInvoice> => {
  const uploadIds = await uploadPurchaseInvoiceFiles(files);
  const response = await axios.post<PurchaseInvoice>('public/purchase-invoice', {
    ...purchaseInvoice,
    uploads: uploadIds.map((id) => {
      return { uploadId: id };
    })
  });
  return response.data;
};

const getPurchaseInvoiceUploads = async (purchaseInvoice: PurchaseInvoice): Promise<PurchaseInvoiceUploadedFile[]> => {
  if (!purchaseInvoice?.uploads) return [];

  const uploads = await Promise.all(
    purchaseInvoice.uploads.map(async (u) => {
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
    ) as PurchaseInvoiceUploadedFile[];
};

const download = async (id: number, template: string): Promise<any> => {
  const purchaseInvoice = await findOne(id, []);
  const response = await axios.get<string>(`public/purchase-invoice/${id}/download?template=${template}`, {
    responseType: 'blob'
  });
  const blob = new Blob([response.data], { type: response.headers['content-type'] });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${purchaseInvoice.sequential}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return response;
};

const duplicate = async (duplicatePurchaseInvoiceDto: DuplicatePurchaseInvoiceDto): Promise<PurchaseInvoice> => {
  const response = await axios.post<PurchaseInvoice>('/public/purchase-invoice/duplicate', duplicatePurchaseInvoiceDto);
  return response.data;
};

const update = async (purchaseInvoice: UpdatePurchaseInvoiceDto, files: File[]): Promise<PurchaseInvoice> => {
  const uploadIds = await uploadPurchaseInvoiceFiles(files);
  const response = await axios.put<PurchaseInvoice>(`public/purchase-invoice/${purchaseInvoice.id}`, {
    ...purchaseInvoice,
    uploads: [
      ...(purchaseInvoice.uploads || []),
      ...uploadIds.map((id) => {
        return { uploadId: id };
      })
    ]
  });
  return response.data;
};

const remove = async (id: number): Promise<PurchaseInvoice> => {
  const response = await axios.delete<PurchaseInvoice>(`public/purchase-invoice/${id}`);
  return response.data;
};

const validate = (purchaseInvoice: Partial<PurchaseInvoice>, dateRange?: DateRange): ToastValidation => {
  if (!purchaseInvoice.date) return { message: 'La date est obligatoire' };
  const purchaseInvoiceDate = new Date(purchaseInvoice.date);
  if (
    dateRange?.from &&
    !isAfter(purchaseInvoiceDate, dateRange.from) &&
    purchaseInvoiceDate.getTime() !== dateRange.from.getTime()
  ) {
    return { message: `La date doit être après ou égale à ${dateRange.from.toLocaleDateString()}` };
  }
  if (
    dateRange?.to &&
    !isAfter(purchaseInvoiceDate, dateRange.to) &&
    purchaseInvoiceDate.getTime() !== dateRange.to.getTime()
  ) {
    return { message: `La date doit être avant ou égale à ${dateRange.to.toLocaleDateString()}` };
  }
  if (!purchaseInvoice.dueDate) return { message: "L'échéance est obligatoire" };
  if (!purchaseInvoice.object) return { message: "L'objet est obligatoire" };
  const dueDate = new Date(purchaseInvoice.dueDate);
  if (differenceInDays(purchaseInvoiceDate, dueDate) > 0) {
    return { message: "L'échéance doit être supérieure ou égale à la date" };
  }
  if (!purchaseInvoice.firmId || !purchaseInvoice.interlocutorId) {
    return { message: 'Entreprise et interlocuteur sont obligatoire' };
  }
  return { message: '' };
};

const updatePurchaseInvoiceSequentials = async (updatedSequenceDto: UpdatePurchaseInvoiceSequentialNumber) => {
  const response = await axios.put<PurchaseInvoice>(
    `/public/purchase-invoice/update-purchase-invoice-sequences`,
    updatedSequenceDto
  );
  return response.data;
};

export const purchaseInvoice = {
  factory,
  findPaginated,
  findOne,
  findByRange,
  create,
  download,
  duplicate,
  update,
  updatePurchaseInvoiceSequentials,
  remove,
  validate
};
