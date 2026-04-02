import { Form } from 'antd';
import { TextField, Switch } from '@mui/material';
import useLanguage from '@/locale/useLanguage';

const formItems = [
  {
    settingKey: 'company_name',
    valueType: 'string',
  },
  {
    settingKey: 'company_address',
    valueType: 'string',
  },
  {
    settingKey: 'company_state',
    valueType: 'string',
  },
  {
    settingKey: 'company_country',
    valueType: 'string',
  },
  {
    settingKey: 'company_email',
    valueType: 'string',
  },
  {
    settingKey: 'company_phone',
    valueType: 'string',
  },
  {
    settingKey: 'company_website',
    valueType: 'string',
  },

  {
    settingKey: 'company_tax_number',
    valueType: 'string',
  },
  {
    settingKey: 'company_vat_number',
    valueType: 'string',
  },
  {
    settingKey: 'company_reg_number',
    valueType: 'string',
  },
];

export default function SettingForm() {
  const translate = useLanguage();

  return (
    <div>
      {formItems.map((item) => {
        return (
          <Form.Item
            key={item.settingKey}
            label={item.label ? translate(item.label) : translate(item.settingKey)}
            name={item.settingKey}
            {...(item.valueType === 'number'
              ? {
                  getValueFromEvent: (event) => {
                    const value = event?.target?.value;
                    return value === '' ? '' : Number(value);
                  },
                }
              : {})}
            rules={[
              {
                required: false,
              },
            ]}
            valuePropName={item.valueType === 'boolean' ? 'checked' : 'value'}
          >
            {item.valueType === 'string' && <TextField fullWidth size="small" autoComplete="off" />}
            {item.valueType === 'number' && (
              <TextField fullWidth size="small" type="number" inputProps={{ min: 0 }} />
            )}
            {item.valueType === 'boolean' && <Switch />}
            {item.valueType === 'array' && <TextField fullWidth size="small" />}
          </Form.Item>
        );
      })}
    </div>
  );
}
