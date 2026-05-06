import { useMemo, useState } from 'react';
import { Button, Card, Col, Radio, Row, Space, Steps, Tag, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import CreateInvoiceModule from '@/modules/InvoiceModule/CreateInvoiceModule';

const { Title, Paragraph } = Typography;

const invoiceTypeOptions = [
  { label: 'Sales Invoice', value: 'sales' },
  { label: 'Service Invoice', value: 'service' },
  { label: 'SEZ Sales Invoice', value: 'sez-sales' },
  { label: 'SEZ Service Invoice', value: 'sez-service' },
  { label: 'Export Sales Invoice', value: 'export-sales' },
  { label: 'Export Service Invoice', value: 'export-service' },
];

const taxTypeOptions = [
  { label: 'Local State (CGST + SGST)', value: 'local' },
  { label: 'Inter-State (IGST)', value: 'inter-state' },
];

const lutOptions = [
  { label: 'With LUT', value: 'with-lut' },
  { label: 'Without LUT', value: 'without-lut' },
];

export default function InvoiceCreate() {
  const entity = 'invoice';
  const translate = useLanguage();
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState({
    invoiceType: 'sales',
    taxType: 'local',
    lutOption: 'without-lut',
  });

  const Labels = useMemo(
    () => ({
      PANEL_TITLE: translate('invoice'),
      DATATABLE_TITLE: translate('invoice_list'),
      ADD_NEW_ENTITY: translate('add_new_invoice'),
      ENTITY_NAME: translate('invoice'),
      RECORD_ENTITY: translate('record_payment'),
    }),
    [translate]
  );

  const configPage = useMemo(
    () => ({
      entity,
      ...Labels,
      INVOICE_CONTEXT: selection,
    }),
    [entity, Labels, selection]
  );

  if (step === 1) {
    return (
      <div className="dashboardV2">
        <Card className="dashboardCard mrgTop16">
          <Space align="center" style={{ marginBottom: 12 }}>
            <CheckCircleOutlined style={{ color: 'var(--primary)' }} />
            <Title level={4} style={{ margin: 0 }}>
              Invoice Setup Selected
            </Title>
          </Space>
          <Space wrap>
            <Tag className="statusBadge">{selection.invoiceType}</Tag>
            <Tag className="statusBadge">{selection.taxType}</Tag>
            <Tag className="statusBadge">{selection.lutOption}</Tag>
            <Button onClick={() => setStep(0)}>Edit Selection</Button>
          </Space>
        </Card>
        <CreateInvoiceModule config={configPage} />
      </div>
    );
  }

  return (
    <div className="dashboardV2">
      <Card className="dashboardCard">
        <Title level={3}>Invoice Type Wizard</Title>
        <Paragraph type="secondary">
          Select invoice type, tax regime, and LUT handling before entering invoice line items.
        </Paragraph>

        <Steps
          current={0}
          items={[
            { title: 'Invoice Type' },
            { title: 'Tax Regime' },
            { title: 'LUT Option' },
            { title: 'Create Invoice' },
          ]}
          style={{ marginBottom: 24 }}
        />

        <div className="erpFormWrapper">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card size="small" title="Invoice Type">
              <Radio.Group
                value={selection.invoiceType}
                onChange={(e) => setSelection((prev) => ({ ...prev, invoiceType: e.target.value }))}
              >
                <Space direction="vertical">
                  {invoiceTypeOptions.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" title="Tax Type">
              <Radio.Group
                value={selection.taxType}
                onChange={(e) => setSelection((prev) => ({ ...prev, taxType: e.target.value }))}
              >
                <Space direction="vertical">
                  {taxTypeOptions.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" title="LUT Option">
              <Radio.Group
                value={selection.lutOption}
                onChange={(e) => setSelection((prev) => ({ ...prev, lutOption: e.target.value }))}
              >
                <Space direction="vertical">
                  {lutOptions.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Card>
          </Col>
        </Row>

        <div className="erpFormActions">
          <Button type="primary" onClick={() => setStep(1)}>
            Continue to Invoice Form
          </Button>
        </div>
        </div>
      </Card>
    </div>
  );
}
