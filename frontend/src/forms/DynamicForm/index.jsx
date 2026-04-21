import { useMemo, useCallback } from 'react';
import { DatePicker, Input, Form, Select, InputNumber, Switch, Tag } from 'antd';

import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { useMoney, useDate } from '@/settings';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import SelectAsync from '@/components/SelectAsync';

import { countryList } from '@/utils/countryList';

export default function DynamicForm({ fields, isUpdateForm = false }) {
  const form = Form.useFormInstance();
  const feedbackFieldKey = useMemo(
    () => Object.keys(fields).find((key) => fields[key].hasFeedback),
    [fields]
  );
  const feedback = Form.useWatch(feedbackFieldKey, form);

  // Debug logging
  console.log('DynamicForm - fields:', Object.keys(fields));
  console.log('DynamicForm - isUpdateForm:', isUpdateForm);
  console.log('DynamicForm - feedbackFieldKey:', feedbackFieldKey);
  console.log('DynamicForm - feedback value:', feedback);

  return (
    <div>
      {Object.keys(fields).map((key) => {
        const field = {
          ...fields[key],
          name: key,
          label: fields[key].label || key,
        };

        if ((isUpdateForm && !field.disableForUpdate) || !field.disableForForm) {
          if (field.hasFeedback) {
            return <FormElement key={key} field={field} />;
          } else if (field.feedback) {
            if (feedback === field.feedback) return <FormElement key={key} field={field} />;
            return null;
          } else {
            return <FormElement key={key} field={field} />;
          }
        }
        return null;
      })}
    </div>
  );
}

function FormElement({ field }) {
  const translate = useLanguage();
  const money = useMoney();
  const { dateFormat } = useDate();

  const { TextArea } = Input;

  // Render select field directly without creating component functions
  const renderSelect = () => (
    <Form.Item
      label={translate(field.label)}
      name={field.name}
      initialValue={field.defaultValue}
      rules={[{ required: field.required || false }]}
    >
      <Select showSearch={field.showSearch} style={{ width: '100%' }}>
        {field.options?.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  const renderSelectWithTranslation = () => (
    <Form.Item
      label={translate(field.label)}
      name={field.name}
      initialValue={field.defaultValue}
      rules={[{ required: field.required || false }]}
    >
      <Select style={{ width: '100%' }}>
        {field.options?.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            <Tag bordered={false} color={option.color}>
              {translate(option.label)}
            </Tag>
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  const renderSelectWithFeedback = () => (
    <Form.Item
      label={translate(field.label)}
      name={field.name}
      initialValue={field.defaultValue}
      rules={[{ required: field.required || false }]}
    >
      <Select style={{ width: '100%' }}>
        {field.options?.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {translate(option.label)}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  const renderColor = () => (
    <Form.Item
      label={translate(field.label)}
      name={field.name}
      initialValue={field.defaultValue}
      rules={[{ required: field.required || false }]}
    >
      <Select
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
        }
        style={{ width: '100%' }}
      >
        {field.options?.map((option) => (
          <Select.Option key={option.value} value={option.value} label={option.label}>
            <Tag bordered={false} color={option.color}>
              {option.label}
            </Tag>
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  const renderTag = () => (
    <Form.Item
      label={translate(field.label)}
      name={field.name}
      initialValue={field.defaultValue}
      rules={[{ required: field.required || false }]}
    >
      <Select style={{ width: '100%' }}>
        {field.options?.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            <Tag bordered={false} color={option.color}>
              {translate(option.label)}
            </Tag>
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  const renderArray = () => (
    <Form.Item
      label={translate(field.label)}
      name={field.name}
      initialValue={field.defaultValue}
      rules={[{ required: field.required || false }]}
    >
      <Select mode={'multiple'} style={{ width: '100%' }}>
        {field.options?.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  const renderCountry = () => (
    <Form.Item
      label={translate(field.label)}
      name={field.name}
      initialValue={field.defaultValue}
      rules={[{ required: field.required || false }]}
    >
      <Select
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
        }
        style={{ width: '100%' }}
      >
        {countryList.map((language) => (
          <Select.Option
            key={language.value}
            value={language.value}
            label={translate(language.label)}
          >
            {language?.icon && language?.icon + ' '}
            {translate(language.label)}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  const renderSearch = () => (
    <Form.Item
      label={translate(field.label)}
      name={field.name}
      rules={[{ required: field.required || false }]}
    >
      <AutoCompleteAsync
        entity={field.entity}
        displayLabels={field.displayLabels}
        searchFields={field.searchFields}
        outputValue={field.outputValue}
        withRedirect={field.withRedirect}
        urlToRedirect={field.urlToRedirect}
        redirectLabel={field.redirectLabel}
      />
    </Form.Item>
  );

  switch (field.type) {
    case 'select':
      return renderSelect();
    case 'selectWithTranslation':
      return renderSelectWithTranslation();
    case 'selectWithFeedback':
      return renderSelectWithFeedback();
    case 'color':
      return renderColor();
    case 'tag':
      return renderTag();
    case 'array':
      return renderArray();
    case 'country':
      return renderCountry();
    case 'search':
      return renderSearch();
    default:
      // For all other types, render the basic component
      const compunedComponent = {
        string: <Input autoComplete="off" maxLength={field.maxLength} />,
        url: <Input addonBefore="http://" autoComplete="off" placeholder="www.example.com" />,
        textarea: <TextArea rows={4} />,
        email: <Input autoComplete="off" placeholder="email@example.com" />,
        number: <InputNumber style={{ width: '100%' }} />,
        phone: <Input style={{ width: '100%' }} placeholder="+1 123 456 789" />,
        boolean: (
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        ),
        date: (
          <DatePicker
            placeholder={translate('select_date')}
            style={{ width: '100%' }}
            format={dateFormat}
          />
        ),
        async: (
          <SelectAsync
            entity={field.entity}
            displayLabels={field.displayLabels}
            outputValue={field.outputValue}
            loadDefault={field.loadDefault}
            withRedirect={field.withRedirect}
            urlToRedirect={field.urlToRedirect}
            redirectLabel={field.redirectLabel}
          />
        ),
        currency: (
          <InputNumber
            className="moneyInput"
            min={0}
            controls={false}
            addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
          />
        ),
      };

      const filedType = {
        string: 'string',
        textarea: 'string',
        number: 'number',
        phone: 'string',
        url: 'url',
        website: 'url',
        email: 'email',
      };

      let renderComponent = compunedComponent[field.type];
      if (!renderComponent) {
        renderComponent = compunedComponent['string'];
      }

      return (
        <Form.Item
          label={translate(field.label)}
          name={field.name}
          initialValue={field.defaultValue}
          rules={[{ required: field.required || false, type: filedType[field.type] ?? 'any' }]}
          valuePropName={field.type === 'boolean' ? 'checked' : 'value'}
        >
          {renderComponent}
        </Form.Item>
      );
  }
}
