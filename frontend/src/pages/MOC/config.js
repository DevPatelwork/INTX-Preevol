export const fields = {
  company: { type: 'async', entity: 'company', displayLabels: ['name'], outputValue: '_id', required: true, disableForTable: true },
  companyName: { type: 'string', label: 'company', dataIndex: ['company', 'name'], disableForForm: true },
  mocName: { type: 'string', required: true },
};
