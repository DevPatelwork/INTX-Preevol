import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Row, Col } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { useMoney } from '@/settings';
import calculate from '@/utils/calculate';
import SelectAsync from '@/components/SelectAsync';

export default function ItemRow({ field, remove, current = null }) {
  const form = Form.useFormInstance();
  const rowQuantity = Form.useWatch(['items', field.name, 'quantity'], form);
  const rowPrice = Form.useWatch(['items', field.name, 'price'], form);
  const [totalState, setTotal] = useState(undefined);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const money = useMoney();
  const updateQt = (value) => {
    setQuantity(value);
  };
  const updatePrice = (value) => {
    setPrice(value);
  };
  const setRowField = (key, value) => {
    form?.setFields?.([{ name: ['items', field.name, key], value }]);
  };
  const updateProduct = (productName, product) => {
    const selectedProduct = product || {};
    const selectedPriceRaw =
      selectedProduct?.rate ??
      selectedProduct?.price ??
      selectedProduct?.salePrice ??
      selectedProduct?.unitPrice ??
      0;
    const selectedPrice = Number.parseFloat(selectedPriceRaw);
    const safePrice = Number.isFinite(selectedPrice) ? selectedPrice : 0;
    const safeName = selectedProduct?.name || productName || '';
    const existingDescription = form?.getFieldValue?.(['items', field.name, 'description']);
    const updatedDescription =
      existingDescription ||
      (typeof selectedProduct?.description === 'string' ? selectedProduct.description : '');

    setRowField('itemName', safeName);
    setRowField('product', selectedProduct?._id || undefined);
    setRowField('price', safePrice);
    setRowField('description', updatedDescription);

    setPrice(safePrice);
  };

  useEffect(() => {
    if (current) {
      // When it accesses the /payment/ endpoint,
      // it receives an invoice.item instead of just item
      // and breaks the code, but now we can check if items exists,
      // and if it doesn't we can access invoice.items.

      const { items, invoice } = current;

      if (invoice) {
        const item = invoice[field.fieldKey];

        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
        }
      } else {
        const item = items[field.fieldKey];

        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
        }
      }
    }
  }, [current]);

  useEffect(() => {
    setQuantity(Number(rowQuantity || 0));
  }, [rowQuantity]);

  useEffect(() => {
    setPrice(Number(rowPrice || 0));
  }, [rowPrice]);

  useEffect(() => {
    const currentTotal = calculate.multiply(price, quantity);

    setTotal(currentTotal);
    setRowField('total', currentTotal);
  }, [price, quantity]);

  return (
    <Row gutter={[12, 12]} style={{ position: 'relative' }}>
      <Col className="gutter-row" span={5}>
        <Form.Item
          name={[field.name, 'itemName']}
          rules={[
            {
              required: true,
              message: 'Please select product',
            },
          ]}
        >
          <SelectAsync
            entity={'product'}
            displayLabels={['name', 'hsnOrSac']}
            outputValue={'name'}
            onChange={updateProduct}
            withRedirect={true}
            urlToRedirect={'/product'}
            redirectLabel={'Add New Product'}
            placeholder="Select Product"
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={7}>
        <Form.Item name={[field.name, 'product']} hidden>
          <Input />
        </Form.Item>
        <Form.Item name={[field.name, 'description']}>
          <Input placeholder="description Name" />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={3}>
        <Form.Item name={[field.name, 'quantity']} rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} onChange={updateQt} />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item name={[field.name, 'price']} rules={[{ required: true }]}>
          <InputNumber
            className="moneyInput"
            onChange={updatePrice}
            min={0}
            controls={false}
            addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={5}>
        <Form.Item name={[field.name, 'total']}>
          <Form.Item>
            <InputNumber
              readOnly
              className="moneyInput"
              value={totalState}
              min={0}
              controls={false}
              addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
              addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
              formatter={(value) =>
                money.amountFormatter({ amount: value, currency_code: money.currency_code })
              }
            />
          </Form.Item>
        </Form.Item>
      </Col>

      <div style={{ position: 'absolute', right: '-20px', top: ' 5px' }}>
        <DeleteOutlined onClick={() => remove(field.name)} />
      </div>
    </Row>
  );
}
