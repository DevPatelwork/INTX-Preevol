export const fields = {
  name: {
    type: 'string',
    label: 'Name',
    required: true,
  },
  financialYear: {
    type: 'async',
    label: 'Financial Year',
    entity: 'financialsettings',
    displayLabels: ['financialYear'],
    outputValue: 'financialYear',
    required: true,
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
};
