import UpdateInvoiceModule from '@/modules/InvoiceModule/UpdateInvoiceModule';

export default function TransactionDocumentUpdate({ entity, label }) {
  const config = {
    entity,
    PANEL_TITLE: label,
    DATATABLE_TITLE: `${label} List`,
    ADD_NEW_ENTITY: `Add New ${label}`,
    ENTITY_NAME: label,
    RECORD_ENTITY: 'record_payment',
  };
  return <UpdateInvoiceModule config={config} />;
}
