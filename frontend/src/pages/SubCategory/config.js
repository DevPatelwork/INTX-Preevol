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
  category: {
    type: 'async',
    entity: 'category',
    displayLabels: ['name'],
    outputValue: '_id',
    required: true,
    disableForTable: true,
  },
  categoryName: {
    type: 'string',
    label: 'category',
    dataIndex: ['category', 'name'],
    disableForForm: true,
  },
  name: {
    type: 'string',
    required: true,
  },
};
