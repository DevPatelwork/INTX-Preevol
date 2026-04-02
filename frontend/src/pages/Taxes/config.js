export const fields = {
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
