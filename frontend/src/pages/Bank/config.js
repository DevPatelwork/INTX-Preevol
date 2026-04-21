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
    label: 'company',
    dataIndex: ['company', 'name'],
    disableForForm: true,
  },
  bankName: { type: 'string', required: true },
  branchName: { type: 'string' },
  accountNo: { type: 'string' },
  micrCode: { type: 'number' },
  ifscCode: { type: 'string' },
  swiftCode: { type: 'string' },
};
