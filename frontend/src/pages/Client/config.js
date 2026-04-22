export const fields = {
  name: {
    type: 'string',
    label: 'Party/Customer Name',
    required: true,
  },
  company: {
    type: 'string',
    label: 'Company',
  },
  contactPerson: {
    type: 'string',
    label: 'Contact Person',
  },
  contact1: {
    type: 'string',
    label: 'Primary Phone',
  },
  contact2: {
    type: 'string',
    label: 'Secondary Phone',
  },
  email: {
    type: 'email',
    label: 'Email',
  },
  website: {
    type: 'url',
    label: 'Website',
  },
  address: {
    type: 'string',
    label: 'Address',
  },
  city: {
    type: 'string',
    label: 'City',
  },
  state: {
    type: 'string',
    label: 'State',
  },
  stateCode: {
    type: 'number',
    label: 'State Code',
  },
  pin: {
    type: 'string',
    label: 'Pin Code',
  },
  gstStatus: {
    type: 'select',
    label: 'GST Status',
    options: [
      { value: 'Registered', label: 'Registered' },
      { value: 'Unregistered', label: 'Unregistered' },
      { value: 'Composition', label: 'Composition' },
      { value: 'Consumer', label: 'Consumer' },
    ],
  },
  gstin: {
    type: 'string',
    label: 'GSTIN',
  },
  panNo: {
    type: 'string',
    label: 'PAN Number',
  },
  vatNo: {
    type: 'string',
    label: 'VAT Number',
  },
  cstNo: {
    type: 'string',
    label: 'CST Number',
  },
  eccNo: {
    type: 'string',
    label: 'ECC Number',
  },
  iecCode: {
    type: 'string',
    label: 'IEC Code',
  },
};

export const dataTableColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Company',
    dataIndex: 'company',
  },
  {
    title: 'Contact Person',
    dataIndex: 'contactPerson',
  },
  {
    title: 'Primary Phone',
    dataIndex: 'contact1',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'City',
    dataIndex: 'city',
  },
  {
    title: 'State',
    dataIndex: 'state',
  },
  {
    title: 'GSTIN',
    dataIndex: 'gstin',
  },
];
