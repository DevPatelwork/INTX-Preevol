export const fields = {
  enabled: { type: 'boolean', label: 'Enabled', defaultValue: true },
  company: { type: 'async', entity: 'company', displayLabels: ['name'], outputValue: '_id', required: true, disableForTable: true },
  companyName: { type: 'string', label: 'company', dataIndex: ['company', 'name'], disableForForm: true },
  taxName: {
    type: 'string',
    required: true,
    label: 'name',
  },
  taxValue: {
    type: 'number',
    required: true,
    label: 'value',
  },
  enabled: {
    type: 'boolean',
  },
  isDefault: {
    type: 'boolean',
    label: 'default',
  },
};
