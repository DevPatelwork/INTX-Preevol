export const fields = {
  enabled: {
    type: 'boolean',
    label: 'Enabled',
    defaultValue: true,
  },
  name: {
    type: 'string',
    label: 'Company Name',
    required: true,
  },
  
  // Address Section
  address: {
    type: 'textarea',
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
    type: 'string',
    label: 'State Code',
  },
  pin: {
    type: 'string',
    label: 'PIN Code',
  },
  
  // Contact Information
  contact: {
    type: 'phone',
    label: 'Contact Number',
  },
  email: {
    type: 'email',
    label: 'Email',
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
  
  // Tax Registration
  gstin: {
    type: 'string',
    label: 'GSTIN',
  },
  panNo: {
    type: 'string',
    label: 'PAN No',
  },
  tanNo: {
    type: 'string',
    label: 'TAN No',
  },
  cinNo: {
    type: 'string',
    label: 'CIN No',
  },
  lutNo: {
    type: 'string',
    label: 'LUT No',
  },
  
  // Financial Information
  financialYear: {
    type: 'select',
    label: 'Financial Year',
    options: [
      { value: '2023-24', label: '2023-24' },
      { value: '2024-25', label: '2024-25' },
      { value: '2025-26', label: '2025-26' },
      { value: '2026-27', label: '2026-27' },
      { value: '2027-28', label: '2027-28' },
      { value: '2028-29', label: '2028-29' },
    ],
  },
  startDate: {
    type: 'date',
    label: 'Financial Year Start',
  },
  endDate: {
    type: 'date',
    label: 'Financial Year End',
  },
  
  // Bank Details
  bankName: {
    type: 'string',
    label: 'Bank Name',
  },
  accountNo: {
    type: 'string',
    label: 'Account No',
  },
  ifscCode: {
    type: 'string',
    label: 'IFSC Code',
  },
  branch: {
    type: 'string',
    label: 'Branch',
  },
  
  // Terms & Conditions
  termsAndConditions: {
    type: 'textarea',
    label: 'Terms & Conditions',
    rows: 4,
  },
  
  // Other
  supplyFrom: {
    type: 'string',
    label: 'Supply From',
  },
};
