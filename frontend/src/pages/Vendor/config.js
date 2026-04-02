export const fields = {
  name: {
    type: 'string',
    label: 'Vendor Name',
    required: true,
  },
  contactPerson: {
    type: 'string',
    label: 'Contact Person',
  },
  contactNo1: {
    type: 'phone',
    label: 'Contact No 1',
  },
  contactNo2: {
    type: 'phone',
    label: 'Contact No 2',
  },
  address: {
    type: 'textarea',
    label: 'Address',
    required: true,
  },
  city: {
    type: 'string',
    label: 'City',
    required: true,
  },
  state: {
    type: 'string',
    label: 'State',
    required: true,
  },
  stateCode: {
    type: 'string',
    label: 'State Code',
    required: true,
  },
  email: {
    type: 'email',
    label: 'Email',
  },
  website: {
    type: 'string',
    label: 'Website',
  },
  gstStatus: {
    type: 'select',
    label: 'GST Status',
    required: true,
    options: [
      { value: 'Registered', label: 'Registered' },
      { value: 'Unregistered', label: 'Unregistered' },
      { value: 'Composition', label: 'Composition' },
    ],
  },
  gstin: {
    type: 'string',
    label: 'GSTIN',
    required: true,
  },
  panNo: {
    type: 'string',
    label: 'PAN No.',
    required: true,
  },
  vatNo: {
    type: 'string',
    label: 'VAT No.',
  },
  cstNo: {
    type: 'string',
    label: 'CST No.',
  },
  eccNo: {
    type: 'string',
    label: 'ECC No.',
  },
  iecCode: {
    type: 'string',
    label: 'IEC Code',
  },
};
