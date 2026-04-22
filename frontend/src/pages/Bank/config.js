export const fields = {
  enabled: { type: 'boolean', label: 'Enabled', defaultValue: true },
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
    label: 'Company',
    dataIndex: ['company', 'name'],
    disableForForm: true,
  },
  
  // Bank Information
  bankName: { 
    type: 'string', 
    label: 'Bank Name',
    required: true 
  },
  
  // Account Information
  accountName: { 
    type: 'string',
    label: 'Account Name (Account Holder)',
  },
  accountNo: { 
    type: 'string',
    label: 'Account Number',
  },
  
  // Branch Information
  branch: { 
    type: 'string',
    label: 'Branch',
  },
  branchName: { 
    type: 'string',
    label: 'Branch Name (Alternate)',
  },
  address: { 
    type: 'textarea',
    label: 'Bank Address',
  },
  
  // Banking Codes
  ifscCode: { 
    type: 'string',
    label: 'IFSC Code',
  },
  micrCode: { 
    type: 'string',
    label: 'MICR Code',
  },
  swiftCode: { 
    type: 'string',
    label: 'SWIFT Code',
  },
};
