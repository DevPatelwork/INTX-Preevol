export const fields = {
  enabled: {
    type: 'boolean',
    label: 'Enabled',
    defaultValue: true,
  },
  name: {
    type: 'string',
    label: 'Name',
    required: true,
  },
  financialYear: {
    type: 'select',
    label: 'Financial Year',
    required: true,
    options: [
      { value: '2023-24', label: '2023-24' },
      { value: '2024-25', label: '2024-25' },
      { value: '2025-26', label: '2025-26' },
      { value: '2026-27', label: '2026-27' },
      { value: '2027-28', label: '2027-28' },
      { value: '2028-29', label: '2028-29' },
    ],
  },
  gstin: {
    type: 'string',
    label: 'GSTIN',
  },
  panNo: {
    type: 'string',
    label: 'PAN No',
  },
  state: {
    type: 'string',
    label: 'State',
  },
  stateCode: {
    type: 'string',
    label: 'State Code',
  },
  address: {
    type: 'textarea',
    label: 'Address',
  },
  pin: {
    type: 'string',
    label: 'PIN Code',
  },
  phone1: {
    type: 'phone',
    label: 'Phone 1',
  },
  phone2: {
    type: 'phone',
    label: 'Phone 2',
  },
  email1: {
    type: 'email',
    label: 'Email 1',
  },
  email2: {
    type: 'email',
    label: 'Email 2',
  },
  website: {
    type: 'string',
    label: 'Website',
  },
  supplyFrom: {
    type: 'string',
    label: 'Supply From',
  },
  startDate: {
    type: 'date',
    label: 'Start Date',
  },
  endDate: {
    type: 'date',
    label: 'End Date',
  },
};
