export const fields = {
  company: { type: 'async', entity: 'company', displayLabels: ['name'], outputValue: '_id', required: true, disableForTable: true },
  companyName: { type: 'string', label: 'company', dataIndex: ['company', 'name'], disableForForm: true },
  category: { type: 'async', entity: 'category', displayLabels: ['name'], outputValue: '_id', disableForTable: true },
  categoryName: { type: 'string', label: 'category', dataIndex: ['category', 'name'], disableForForm: true },
  subCategory: { type: 'async', entity: 'subcategory', displayLabels: ['name'], outputValue: '_id', disableForTable: true },
  subCategoryName: { type: 'string', label: 'subCategory', dataIndex: ['subCategory', 'name'], disableForForm: true },
  productName: { type: 'string', required: true },
  uom: { type: 'string' },
  hsnNoOrSacNo: { type: 'string' },
  machineNo: { type: 'string' },
  price: { type: 'number' },
  fullProductName: { type: 'string' },
};
