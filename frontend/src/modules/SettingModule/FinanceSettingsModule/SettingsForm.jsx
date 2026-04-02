import { Form } from 'antd';
import { TextField, Switch } from '@mui/material';
import useLanguage from '@/locale/useLanguage';

const formItems = [
  {
    label: 'last_invoice_number',
    settingKey: 'last_invoice_number',
    valueType: 'number',
  },
  {
    label: 'last_quote_number',
    settingKey: 'last_quote_number',
    valueType: 'number',
  },
  {
    label: 'last_payment_number',
    settingKey: 'last_payment_number',
    valueType: 'number',
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
                required: true,
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
