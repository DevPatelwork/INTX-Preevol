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
  name: {
    type: 'string',
    required: true,
  },
  category: {
    type: 'string',
  },
  subCategory: {
    type: 'string',
  },
  description: {
    type: 'textarea',
  },
  hsnOrSac: {
    type: 'string',
  },
  uom: {
    type: 'string',
  },
  gstRate: {
    type: 'number',
  },
  rate: {
    type: 'currency',
  },
  isService: {
    type: 'boolean',
  },
};
