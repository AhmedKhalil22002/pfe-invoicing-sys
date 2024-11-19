import axios from './axios';
import { differenceInDays } from 'date-fns';
import { DISCOUNT_TYPE } from '../types/enums/discount-types';
import { upload } from './upload';
import { api } from '.';
import {
  CreateInvoiceDto,
  DuplicateInvoiceDto,
  INVOICE_STATUS,
  Invoice,
  InvoiceUploadedFile,
  PagedInvoice,
  ToastValidation,
  UpdateInvoiceDto,
  UpdateInvoiceSequentialNumber
} from '@/types';
import { INVOICE_FILTER_ATTRIBUTES } from '@/constants/invoice.filter-attributes';

const factory = (): CreateInvoiceDto => {
  return {
    date: '',
    dueDate: '',
    status: INVOICE_STATUS.Unpaid,
    generalConditions: '',
    total: 0,
    subTotal: 0,
    discount: 0,
    discount_type: DISCOUNT_TYPE.AMOUNT,
    currencyId: 0,
    firmId: 0,
    interlocutorId: 0,
    notes: '',
    articleInvoiceEntries: [],
    invoiceMetaData: {
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
): Promise<PagedInvoice> => {
  const generalFilter = search
    ? Object.values(INVOICE_FILTER_ATTRIBUTES)
        .map((key) => `${key}||$cont||${search}`)
        .join('||$or||')
    : '';
  const firmCondition = firmId ? `firmId||$eq||${firmId}` : '';
  const interlocutorCondition = interlocutorId ? `interlocutorId||$cont||${interlocutorId}` : '';
  const filters = [generalFilter, firmCondition, interlocutorCondition].filter(Boolean).join(',');

  const response = await axios.get<PagedInvoice>(
    new String().concat(
      'public/invoice/list?',
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
    'quotation',
    'interlocutor',
    'firm.currency',
    'invoiceMetaData',
    'uploads',
    'uploads.upload',
    'payments',
    'payments.payment',
    'firm.deliveryAddress',
    'firm.invoicingAddress',
    'articleInvoiceEntries',
    'firm.interlocutorsToFirm',
    'articleInvoiceEntries.article',
    'articleInvoiceEntries.articleInvoiceEntryTaxes',
    'articleInvoiceEntries.articleInvoiceEntryTaxes.tax'
  ]
): Promise<Invoice & { files: InvoiceUploadedFile[] }> => {
  const response = await axios.get<Invoice>(`public/invoice/${id}?join=${relations.join(',')}`);
  return { ...response.data, files: await getInvoiceUploads(response.data) };
};

const uploadInvoiceFiles = async (files: File[]): Promise<number[]> => {
  return files && files?.length > 0 ? await upload.uploadFiles(files) : [];
};

const create = async (invoice: CreateInvoiceDto, files: File[]): Promise<Invoice> => {
  const uploadIds = await uploadInvoiceFiles(files);
  const response = await axios.post<Invoice>('public/invoice', {
    ...invoice,
    uploads: uploadIds.map((id) => {
      return { uploadId: id };
    })
  });
  return response.data;
};

const getInvoiceUploads = async (invoice: Invoice): Promise<InvoiceUploadedFile[]> => {
  if (!invoice?.uploads) return [];

  const uploads = await Promise.all(
    invoice.uploads.map(async (u) => {
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
    ) as InvoiceUploadedFile[];
};

const download = async (id: number, template: string): Promise<any> => {
  const invoice = await findOne(id, []);
  const response = await axios.get<string>(`public/invoice/${id}/download?template=${template}`, {
    responseType: 'blob'
  });
  const blob = new Blob([response.data], { type: response.headers['content-type'] });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${invoice.sequential}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return response;
};

const duplicate = async (duplicateInvoiceDto: DuplicateInvoiceDto): Promise<Invoice> => {
  const response = await axios.post<Invoice>('/public/invoice/duplicate', duplicateInvoiceDto);
  return response.data;
};

const update = async (invoice: UpdateInvoiceDto, files: File[]): Promise<Invoice> => {
  const uploadIds = await uploadInvoiceFiles(files);
  const response = await axios.put<Invoice>(`public/invoice/${invoice.id}`, {
    ...invoice,
    uploads: [
      ...(invoice.uploads || []),
      ...uploadIds.map((id) => {
        return { uploadId: id };
      })
    ]
  });
  return response.data;
};

const remove = async (id: number): Promise<Invoice> => {
  const response = await axios.delete<Invoice>(`public/invoice/${id}`);
  return response.data;
};

const validate = (invoice: Partial<Invoice>): ToastValidation => {
  if (!invoice.date) return { message: 'La date est obligatoire' };
  if (!invoice.dueDate) return { message: "L'échéance est obligatoire" };
  if (!invoice.object) return { message: "L'objet est obligatoire" };
  if (differenceInDays(new Date(invoice.date), new Date(invoice.dueDate)) >= 0)
    return { message: "L'échéance doit être supérieure à la date" };
  if (!invoice.firmId || !invoice.interlocutorId)
    return { message: 'Entreprise et interlocuteur sont obligatoire' };
  return { message: '' };
};

const updateInvoicesSequentials = async (updatedSequenceDto: UpdateInvoiceSequentialNumber) => {
  const response = await axios.put<Invoice>(
    `/public/invoice/update-invoice-sequences`,
    updatedSequenceDto
  );
  return response.data;
};

export const invoice = {
  factory,
  findPaginated,
  findOne,
  create,
  download,
  duplicate,
  update,
  updateInvoicesSequentials,
  remove,
  validate
};
