import { Switch, Form, Input, Button, Space, Select } from 'antd';
import { CloseOutlined, CheckOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectCurrentItem } from '@/redux/crud/selectors';
import { useState } from 'react';

import useLanguage from '@/locale/useLanguage';

const { Option } = Select;

export function SelectType() {
  const translate = useLanguage();

  return (
    <Form.List name="settingValue" initialValue={[{ Label: '', Value: '' }]}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => (
            <Space key={field.key} align="center">
              <Form.Item
                {...field}
                label={translate('Label')}
                name={[field.name, 'label']}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                {...field}
                label={translate('Value')}
                name={[field.name, 'Value']}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <MinusCircleOutlined onClick={() => remove(field.name)} />
            </Space>
          ))}

          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Add Select Options
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
}

export default function AdvancedSettingsForm({ isUpdateForm = false }) {
  const translate = useLanguage();
  const { result } = useSelector(selectCurrentItem);
  const [type, setType] = useState(null);
  const options = ['number', 'text', 'date'];

  const handleChange = (value) => {
    setType(value);
  };
  return (
    <>
      <Form.Item
        label={translate('Setting Category')}
        name="settingCategory"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select placeholder={translate('Select')}>
          <Option value="app_settings">{translate('App Settings')}</Option>
          <Option value="crm_settings">{translate('CRM Settings')}</Option>
          <Option value="finance_settings">{translate('Finance Settings')}</Option>
          <Option value="company_settings">{translate('Company Settings')}</Option>
          <Option value="money_format_settings">{translate('Money Format Settings')}</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label={translate('Setting Name')}
        name="settingKey"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input type="text" />
      </Form.Item>

      <Form.Item
        label={translate('type')}
        name="settingType"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select placeholder={translate('Select')} onChange={handleChange}>
          <Option value="text">Text</Option>
          <Option value="number">Number</Option>
          <Option value="date">Date</Option>
          <Option value="select">Select</Option>
        </Select>
      </Form.Item>
      {type ? (
        type === 'select' ? (
          <SelectType />
        ) : (
          <Form.Item
            label="Value"
            name="settingValue"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type={type} />
          </Form.Item>
        )
      ) : null}

      <Form.Item
        label={translate('enabled')}
        name="enabled"
        style={{
          display: 'inline-block',
          width: '100%',
          paddingRight: '5px',
        }}
        valuePropName="checked"
        initialValue={true}
      >
        <Switch
          disabled={result ? result.isCoreSetting : false}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      </Form.Item>
    </>
  );
}
