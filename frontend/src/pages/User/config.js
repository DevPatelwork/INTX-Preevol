export const fields = {
  enabled: {
    type: 'boolean',
    label: 'Enabled',
    defaultValue: true,
  },
  email: {
    type: 'email',
    label: 'Email',
    required: true,
  },
  name: {
    type: 'string',
    label: 'First Name',
    required: true,
  },
  surname: {
    type: 'string',
    label: 'Last Name',
  },
  role: {
    type: 'select',
    label: 'Role',
    required: true,
    options: [
      { value: 'owner', label: 'Owner (Full Access)' },
      { value: 'admin', label: 'Admin (Manage Data)' },
      { value: 'user', label: 'User (Basic Access)' },
    ],
  },
  subscriptionTier: {
    type: 'select',
    label: 'Subscription Tier',
    options: [
      { value: 'free', label: 'Free (5 users, 30 days)' },
      { value: 'basic', label: 'Basic (10 users, 90 days)' },
      { value: 'pro', label: 'Pro (25 users, 1 year)' },
      { value: 'enterprise', label: 'Enterprise (Unlimited, 1 year)' },
    ],
  },
  licenseExpiryDate: {
    type: 'date',
    label: 'License Expiry Date',
  },
  maxUsers: {
    type: 'number',
    label: 'Max Users Allowed',
  },
  isLicenseActive: {
    type: 'boolean',
    label: 'License Active',
    defaultValue: true,
  },
  password: {
    type: 'password',
    label: 'Password',
    required: true,
    onlyForm: true,
    disableForTable: true,
  },
  confirmPassword: {
    type: 'password',
    label: 'Confirm Password',
    required: true,
    onlyForm: true,
    disableForTable: true,
  },
};

export const dataTableColumns = [
  {
    title: 'Enabled',
    dataIndex: 'enabled',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Surname',
    dataIndex: 'surname',
  },
  {
    title: 'Role',
    dataIndex: 'role',
  },
  {
    title: 'Subscription Tier',
    dataIndex: 'subscriptionTier',
  },
  {
    title: 'License Expiry',
    dataIndex: 'licenseExpiryDate',
  },
  {
    title: 'License Active',
    dataIndex: 'isLicenseActive',
  },
];
