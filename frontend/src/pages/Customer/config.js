export const fields = {
  name: {
    type: 'string',
    label: 'Name *',
    required: true,
  },
  contactPerson: {
    type: 'string',
    label: 'Contact Person',
  },
  country: {
    type: 'country',
    label: 'Country',
  },
  address: {
    type: 'textarea',
    label: 'Address',
  },
  city: {
    type: 'string',
    label: 'City',
  },
  state: {
    type: 'string',
    label: 'State',
  },
  stateCode: {
    type: 'string',
    label: 'State Code',
  },
  phone: {
    type: 'phone',
    label: 'Phone *',
    required: true,
  },
  email: {
    type: 'email',
    label: 'Email *',
    required: true,
  },
  gstStatus: {
    type: 'select',
    label: 'GST Status *',
    required: true,
    defaultValue: 'Unregistered',
    hasFeedback: true,
    options: [
      { value: 'Registered', label: 'Registered' },
      { value: 'Unregistered', label: 'Unregistered' },
    ],
  },
  gstin: {
    type: 'string',
    label: 'GSTIN',
  },
  panNo: {
    type: 'string',
    label: 'Pan No',
  },
  pin: {
    type: 'string',
    label: 'PIN Code',
  },
};
