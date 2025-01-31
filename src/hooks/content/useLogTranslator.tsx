import { Log } from '@/types';
import useUser from './useUser';
import { EVENT_TYPE } from '@/types/enums/event-types';
import useFirm from './useFirm';
import useInterlocutor from './useInterlocutor';
import useQuotation from './useQuotation';
import useInvoice from './useInvoice';
import useRole from './useRole';
import { Trans } from '@/components/Trans';

export const useLogTranslator = (log: Log) => {
  const { user } = useUser(log.userId);

  //condition Related entity
  //User --------------------------------------------------------------------------------------------
  const crUser = [
    EVENT_TYPE.USER_CREATED,
    EVENT_TYPE.USER_UPDATED,
    EVENT_TYPE.USER_DELETED
  ].includes(log.event!);
  const { user: UserCrUser, isFetchUserPending: isFetchUserPendingCrUser } = useUser(
    log.logInfo?.id,
    crUser
  );

  //User --------------------------------------------------------------------------------------------
  const crRole = [
    EVENT_TYPE.ROLE_CREATED,
    EVENT_TYPE.ROLE_UPDATED,
    EVENT_TYPE.ROLE_DELETED
  ].includes(log.event!);
  const { role: RoleCrRole, isFetchRolePending: isFetchRolePendingCrRole } = useRole(
    log.logInfo?.id,
    crUser
  );

  //Firm --------------------------------------------------------------------------------------------
  const crFirm = [
    EVENT_TYPE.FIRM_CREATED,
    EVENT_TYPE.FIRM_UPDATED,
    EVENT_TYPE.FIRM_DELETED
  ].includes(log.event!);
  const { firm: FirmCrFirm, isFetchFirmPending: isFetchFirmPendingCrFirm } = useFirm(
    log.logInfo?.id,
    crFirm
  );

  //Interlocutor ------------------------------------------------------------------------------------
  //Regular
  const crInterlocutor = [
    EVENT_TYPE.INTERLOCUTOR_CREATED,
    EVENT_TYPE.INTERLOCUTOR_UPDATED,
    EVENT_TYPE.INTERLOCUTOR_DELETED
  ].includes(log.event!);
  const {
    interlocutor: InterlocutorCrInterlocutor,
    isFetchInterlocutorPending: isFetchInterlocutorPendingCrInterlocutor
  } = useInterlocutor(log.logInfo?.id, crInterlocutor);

  //Promoted
  const crInterlocutorPromoted = [EVENT_TYPE.INTERLOCUTOR_PROMOTED].includes(log.event!);
  const {
    interlocutor: promoted,
    isFetchInterlocutorPending: isFetchInterlocutorPendingPromotedCrInterlocutorPromoted
  } = useInterlocutor(log.logInfo?.promoted, crInterlocutorPromoted);
  const {
    interlocutor: demoted,
    isFetchInterlocutorPending: isFetchInterlocutorPendingDemotedCrInterlocutorPromoted
  } = useInterlocutor(log.logInfo?.demoted, crInterlocutorPromoted);
  const {
    firm: FirmCrInterlocutor,
    isFetchFirmPending: isFetchFirmPendingInterlocutorCrInterlocutorPromoted
  } = useFirm(log.logInfo?.firmId, crInterlocutor || crInterlocutorPromoted);

  //quotation --------------------------------------------------------------------------------------
  //Regular
  const crQuotation = [
    EVENT_TYPE.SELLING_QUOTATION_CREATED,
    EVENT_TYPE.SELLING_QUOTATION_UPDATED,
    EVENT_TYPE.SELLING_QUOTATION_DELETED,
    EVENT_TYPE.SELLING_QUOTATION_PRINTED
  ].includes(log.event!);
  const {
    quotation: QuotationCrQuotation,
    isFetchQuotationPending: isFetchQuotationPendingCrQuotation
  } = useQuotation(log.logInfo?.id, crQuotation);

  //Invoiced
  const crQuotationInvoiced = [EVENT_TYPE.SELLING_QUOTATION_INVOICED].includes(log.event!);
  const {
    quotation: quotationCrQuotationInvoice,
    isFetchQuotationPending: isFetchQuotationPendingCrQuotationInvoiced
  } = useQuotation(log.logInfo?.quotationId, crQuotationInvoiced && !!log.logInfo?.quotationId);
  const {
    invoice: invoiceCrQuotationInvoice,
    isFetchInvoicePending: isFetchInvoicePendingCrInvoiceInvoiced
  } = useInvoice(log.logInfo?.invoiceId, crQuotationInvoiced && !!log.logInfo?.invoiceId);

  //Duplicated
  const crQuotationDuplicated = [EVENT_TYPE.SELLING_QUOTATION_DUPLICATED].includes(log.event!);
  const {
    quotation: originalCrQuotationDuplicated,
    isFetchQuotationPending: isFetchQuotationPendingOriginalCrQuotationDuplicated
  } = useQuotation(log.logInfo?.id, crQuotationDuplicated && !!log.logInfo?.id);
  const {
    quotation: duplicateCrQuotationDuplicated,
    isFetchQuotationPending: isFetchQuotationPendingDuplicateCrQuotationDuplicated
  } = useQuotation(log.logInfo?.duplicateId, crQuotationDuplicated && !!log.logInfo?.duplicateId);

  //invoice ----------------------------------------------------------------------------------------
  const crInvoice = [
    EVENT_TYPE.SELLING_INVOICE_CREATED,
    EVENT_TYPE.SELLING_INVOICE_UPDATED,
    EVENT_TYPE.SELLING_INVOICE_DELETED
  ].includes(log.event!);
  const { invoice: InvoiceCrInvoice, isFetchInvoicePending: isFetchInvoicePendingCrInvoice } =
    useInvoice(log.logInfo?.id, crInvoice);
  //Duplicated
  const crInvoiceDuplicated = [EVENT_TYPE.SELLING_INVOICE_DUPLICATED].includes(log.event!);
  const {
    invoice: originalCrInvoiceDuplicated,
    isFetchInvoicePending: isFetchInvoicePendingOriginalCrInvoiceDuplicated
  } = useInvoice(log.logInfo?.id, crInvoiceDuplicated && !!log.logInfo?.id);
  const {
    invoice: duplicateCrInvoiceDuplicated,
    isFetchInvoicePending: isFetchInvoicePendingDuplicateCrInvoiceDuplicated
  } = useInvoice(log.logInfo?.duplicateId, crInvoiceDuplicated && !!log.logInfo?.duplicateId);

  //Logic ------------------------------------------------------------------------------------------
  if (crUser) {
    return (
      <Trans
        ns="logger"
        i18nKey={`events.${log.event}`}
        values={{
          user_name: UserCrUser?.username,
          username: user?.username
        }}
        isPending={isFetchUserPendingCrUser}
      />
    );
  } else if (crRole) {
    return (
      <Trans
        ns="logger"
        i18nKey={`events.${log.event}`}
        values={{
          role_label: RoleCrRole?.label,
          username: user?.username
        }}
        isPending={isFetchRolePendingCrRole}
      />
    );
  } else if (crFirm)
    return (
      <Trans
        ns="logger"
        i18nKey={`events.${log.event}`}
        values={{
          firm_name: FirmCrFirm?.name,
          username: user?.username
        }}
        isPending={isFetchFirmPendingCrFirm}
      />
    );
  else if (crInterlocutor) {
    return (
      <Trans
        ns="logger"
        i18nKey={`events.${log.event}`}
        values={{
          firm_name: FirmCrInterlocutor?.name,
          interlocutor_name: `${InterlocutorCrInterlocutor?.name} ${InterlocutorCrInterlocutor?.surname}`,
          username: user?.username
        }}
        isPending={isFetchInterlocutorPendingCrInterlocutor}
      />
    );
  } else if (crInterlocutorPromoted) {
    return (
      <Trans
        ns="logger"
        i18nKey={`events.${log.event}`}
        values={{
          firm_name: FirmCrInterlocutor?.name,
          promoted: `${promoted?.name} ${promoted?.surname}`,
          demoted: `${demoted?.name} ${demoted?.surname}`,
          username: user?.username
        }}
        isPending={
          isFetchFirmPendingInterlocutorCrInterlocutorPromoted ||
          isFetchInterlocutorPendingPromotedCrInterlocutorPromoted ||
          isFetchInterlocutorPendingDemotedCrInterlocutorPromoted
        }
      />
    );
  } else if (crQuotation) {
    return (
      <Trans
        ns="logger"
        i18nKey={`events.${log.event}`}
        values={{
          quotation_seq: QuotationCrQuotation?.sequential,
          username: user?.username
        }}
        isPending={isFetchQuotationPendingCrQuotation}
      />
    );
  } else if (crQuotationInvoiced) {
    return (
      <Trans
        ns="logger"
        i18nKey={`events.${log.event}${!log.logInfo.invoiceId ? '_marked' : ''}`}
        values={{
          quotation_seq: quotationCrQuotationInvoice?.sequential,
          invoice_seq: invoiceCrQuotationInvoice?.sequential,
          username: user?.username
        }}
        isPending={
          isFetchQuotationPendingCrQuotationInvoiced || isFetchInvoicePendingCrInvoiceInvoiced
        }
      />
    );
  } else if (crQuotationDuplicated) {
    return (
      <Trans
        ns="logger"
        i18nKey={`events.${log.event}`}
        values={{
          quotation_seq: originalCrQuotationDuplicated?.sequential,
          duplicate_seq: duplicateCrQuotationDuplicated?.sequential,
          username: user?.username
        }}
        isPending={
          isFetchQuotationPendingOriginalCrQuotationDuplicated ||
          isFetchQuotationPendingDuplicateCrQuotationDuplicated
        }
      />
    );
  } else if (crInvoice) {
    return (
      <Trans
        ns="logger"
        i18nKey={`events.${log.event}`}
        values={{
          invoice_seq: InvoiceCrInvoice?.sequential,
          username: user?.username
        }}
        isPending={isFetchInvoicePendingCrInvoice}
      />
    );
  } else if (crInvoiceDuplicated) {
    return (
      <Trans
        ns="logger"
        i18nKey={`events.${log.event}`}
        values={{
          invoice_seq: originalCrInvoiceDuplicated?.sequential,
          duplicate_seq: duplicateCrInvoiceDuplicated?.sequential,
          username: user?.username
        }}
        isPending={
          isFetchInvoicePendingOriginalCrInvoiceDuplicated ||
          isFetchInvoicePendingDuplicateCrInvoiceDuplicated
        }
      />
    );
  }
};
