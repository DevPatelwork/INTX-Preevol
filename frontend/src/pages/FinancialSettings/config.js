export const fields = {
  company: {
    type: 'async',
    entity: 'company',
    displayLabels: ['name'],
    outputValue: '_id',
    required: true,
    disableForTable: true,
  },
  companyName: {
    type: 'string',
    label: 'company',
    dataIndex: ['company', 'name'],
    disableForForm: true,
  },
  financialYear: { type: 'string', required: true },
  startDate: { type: 'date', required: true },
  endDate: { type: 'date', required: true },
  salesInvoiceCount: { type: 'string' },
  serviceInvoiceCount: { type: 'string' },
  proformaSalesInvoiceCount: { type: 'string' },
  proformaServiceInvoiceCount: { type: 'string' },
  quotationCount: { type: 'string' },
};
