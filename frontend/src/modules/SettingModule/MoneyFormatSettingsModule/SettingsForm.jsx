import { Form, Input, InputNumber, Select, Switch } from 'antd';

import useLanguage from '@/locale/useLanguage';

import { currencyOptions } from '@/utils/currencyList';

const { Option } = Select;

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
        <Select>
          {currencyOptions().map((currency) => (
            <Option key={currency.value} value={currency.value}>
              {currency.label}
            </Option>
          ))}
        </Select>
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
        <Input />
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
        <Select>
          <Option value="before">{translate('before')}</Option>
          <Option value="after">{translate('after')}</Option>
        </Select>
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
        <Input autoComplete="off" />
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
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label={translate('Cent precision')}
        name="cent_precision"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
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
