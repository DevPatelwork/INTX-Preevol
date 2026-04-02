import { Form } from 'antd';
import { TextField, MenuItem, Switch } from '@mui/material';

import useLanguage from '@/locale/useLanguage';

import { currencyOptions } from '@/utils/currencyList';

export default function SettingsForm() {
  const translate = useLanguage();

  return (
    <div>
      <Form.Item
        label={translate('Currency')}
        name="default_currency_code"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <TextField select fullWidth size="small">
          {currencyOptions().map((currency) => (
            <MenuItem key={currency.value} value={currency.value}>
              {currency.label}
            </MenuItem>
          ))}
        </TextField>
      </Form.Item>
      <Form.Item
        label={translate('Currency Symbol')}
        name="currency_symbol"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <TextField fullWidth size="small" />
      </Form.Item>

      <Form.Item
        label={translate('Currency Position')}
        name="currency_position"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <TextField select fullWidth size="small">
          <MenuItem value="before">{translate('before')}</MenuItem>
          <MenuItem value="after">{translate('after')}</MenuItem>
        </TextField>
      </Form.Item>
      <Form.Item
        label={translate('Decimal Separator')}
        name="decimal_sep"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <TextField fullWidth size="small" autoComplete="off" />
      </Form.Item>
      <Form.Item
        label={translate('Thousand Separator')}
        name="thousand_sep"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <TextField fullWidth size="small" autoComplete="off" />
      </Form.Item>
      <Form.Item
        label={translate('Cent precision')}
        name="cent_precision"
        getValueFromEvent={(event) => {
          const value = event?.target?.value;
          return value === '' ? '' : Number(value);
        }}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <TextField fullWidth size="small" type="number" inputProps={{ min: 0 }} />
      </Form.Item>
      <Form.Item
        label={translate('Zero Format')}
        name="zero_format"
        rules={[
          {
            required: true,
          },
        ]}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    </div>
  );
}
