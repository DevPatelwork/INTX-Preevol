export const fields = {
  invoiceType: {
    type: 'select',
    label: 'Invoice Type',
    required: true,
    options: [
      { value: 'Sales Invoice', label: 'Sales Invoice' },
      { value: 'Service Invoice', label: 'Service Invoice' },
      { value: 'SEZ Sales Invoice', label: 'SEZ Sales Invoice' },
      { value: 'SEZ Service Invoice', label: 'SEZ Service Invoice' },
      { value: 'Export Sales Invoice', label: 'Export Sales Invoice' },
      { value: 'Export Service Invoice', label: 'Export Service Invoice' },
    ],
  },
  taxType: {
    type: 'select',
    label: 'Tax Type',
    required: true,
    options: [
      { value: 'Local State', label: 'Local State (CGST + SGST)' },
      { value: 'Inter-State', label: 'Inter-State (IGST)' },
    ],
  },
  invoiceNumber: {
    type: 'string',
    label: 'Invoice Number',
    required: true,
  },
  invoiceDate: {
    type: 'date',
    label: 'Invoice Date',
    required: true,
  },
  receiverName: {
    type: 'string',
    label: 'Receiver (Bill To)',
    required: true,
  },
  receiverAddress: {
    type: 'string',
    label: 'Receiver Address',
  },
  receiverGstin: {
    type: 'string',
    label: 'Receiver GSTIN',
  },
  consigneeName: {
    type: 'string',
    label: 'Consignee (Ship To)',
  },
  po: {
    type: 'string',
    label: 'PO Reference',
  },
  poDate: {
    type: 'date',
    label: 'PO Date',
  },
  totalAmountBeforeTax: {
    type: 'number',
    label: 'Total Before Tax',
  },
  cgstTotal: {
    type: 'number',
    label: 'CGST Total',
  },
  sgstTotal: {
    type: 'number',
    label: 'SGST Total',
  },
  igstTotal: {
    type: 'number',
    label: 'IGST Total',
  },
  grandTotal: {
    type: 'number',
    label: 'Grand Total',
    required: true,
  },
  status: {
    type: 'select',
    label: 'Status',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'sent', label: 'Sent' },
      { value: 'paid', label: 'Paid' },
      { value: 'overdue', label: 'Overdue' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
  },
};

export const dataTableColumns = [
  {
    title: 'Invoice Number',
    dataIndex: 'invoiceNumber',
  },
  {
    title: 'Type',
    dataIndex: 'invoiceType',
  },
  {
    title: 'Receiver',
    dataIndex: 'receiverName',
  },
  {
    title: 'Invoice Date',
    dataIndex: 'invoiceDate',
  },
  {
    title: 'Grand Total',
    dataIndex: 'grandTotal',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
];
