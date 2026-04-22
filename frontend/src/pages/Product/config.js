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
    label: 'Company',
    dataIndex: ['company', 'name'],
    disableForForm: true,
  },
  name: {
    type: 'string',
    label: 'Product Name',
    required: true,
  },
  fullProductName: {
    type: 'textarea',
    label: 'Full Product Name / Description',
  },
  categoryRef: {
    type: 'async',
    entity: 'category',
    displayLabels: ['name'],
    outputValue: '_id',
    label: 'Category',
    required: true,
  },
  subCategoryRef: {
    type: 'async',
    entity: 'subcategory',
    displayLabels: ['name'],
    outputValue: '_id',
    label: 'Sub Category',
  },
  description: {
    type: 'textarea',
    label: 'Description',
  },
  hsnOrSac: {
    type: 'string',
    label: 'HSN No or SAC No',
  },
  hsnSac: {
    type: 'string',
    label: 'HSN/SAC (Alternate)',
  },
  uom: {
    type: 'select',
    label: 'Unit of Measure (UOM)',
    options: [
      { value: 'NOS', label: 'Numbers (NOS)' },
      { value: 'PCS', label: 'Pieces (PCS)' },
      { value: 'SET', label: 'Set (SET)' },
      { value: 'KG', label: 'Kilogram (KG)' },
      { value: 'MT', label: 'Metric Ton (MT)' },
      { value: 'LTR', label: 'Liter (LTR)' },
      { value: 'MTR', label: 'Meter (MTR)' },
      { value: 'BOX', label: 'Box (BOX)' },
      { value: 'PKT', label: 'Packet (PKT)' },
      { value: 'ROLL', label: 'Roll (ROLL)' },
      { value: 'BAG', label: 'Bag (BAG)' },
      { value: 'CASE', label: 'Case (CASE)' },
      { value: 'UNIT', label: 'Unit (UNIT)' },
    ],
  },
  machineNo: {
    type: 'string',
    label: 'Machine No',
  },
  gstRate: {
    type: 'number',
    label: 'GST Rate (%)',
    min: 0,
    max: 100,
  },
  rate: {
    type: 'currency',
    label: 'Standard Price / Rate',
  },
  price: {
    type: 'currency',
    label: 'Price (Alternate)',
  },
  isService: {
    type: 'boolean',
    label: 'Is Service?',
    defaultValue: false,
  },
};
