import { useMemo, useState } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Select, Steps, Table, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { ErpLayout } from '@/layout';

const { Title, Text } = Typography;

const transportModes = ['Road', 'Rail', 'Air', 'Ship'];
const vehicleTypes = ['Regular', 'Over Dimensional Cargo'];

const stepConfig = [
  {
    title: 'Invoice & Transport',
    fields: ['invoiceRef', 'transporterId', 'transporterName', 'transportMode', 'distance'],
  },
  {
    title: 'Vehicle & Validity',
    fields: ['vehicleNo', 'vehicleType', 'ewayDate', 'validTill'],
  },
];

export default function EWayBillPage() {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [records, setRecords] = useState([]);

  const dataSource = useMemo(
    () =>
      records.map((item, index) => ({
        ...item,
        key: `${item.invoiceRef}-${index}`,
      })),
    [records]
  );

  const onFinish = (values) => {
    const payload = {
      ...values,
      ewayDate: values.ewayDate ? values.ewayDate.toISOString() : null,
      validTill: values.validTill ? values.validTill.toISOString() : null,
      status: 'Draft',
    };
    setRecords((prev) => [payload, ...prev]);
    setStep(0);
    form.resetFields();
  };

  const goNext = async () => {
    await form.validateFields(stepConfig[step].fields);
    setStep((prev) => Math.min(prev + 1, stepConfig.length - 1));
  };

  return (
    <ErpLayout>
      <div className="dashboardV2">
        <Card className="dashboardCard">
          <Title level={3}>E-Way Bill Form</Title>
          <Text type="secondary">Capture transporter, route, and vehicle details for dispatch compliance.</Text>
          <Form form={form} layout="vertical" onFinish={onFinish} className="erpFormWrapper" style={{ marginTop: 20 }}>
            <Steps
              current={step}
              size="small"
              items={stepConfig.map((item) => ({ title: item.title }))}
              style={{ marginBottom: 20 }}
            />
            <Row gutter={[16, 0]}>
              <Col xs={24} md={8} style={{ display: step === 0 ? 'block' : 'none' }}>
                <Form.Item name="invoiceRef" label="Invoice Reference" rules={[{ required: true }]}>
                  <Input placeholder="INV-2026-001" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} style={{ display: step === 0 ? 'block' : 'none' }}>
                <Form.Item name="transporterId" label="Transporter ID" rules={[{ required: true }]}>
                  <Input placeholder="GSTIN / Transport ID" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} style={{ display: step === 0 ? 'block' : 'none' }}>
                <Form.Item name="transporterName" label="Transporter Name" rules={[{ required: true }]}>
                  <Input placeholder="Transporter name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} style={{ display: step === 0 ? 'block' : 'none' }}>
                <Form.Item name="transportMode" label="Transport Mode" rules={[{ required: true }]}>
                  <Select options={transportModes.map((x) => ({ label: x, value: x }))} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} style={{ display: step === 0 ? 'block' : 'none' }}>
                <Form.Item name="distance" label="Distance (KM)" rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: '100%' }} placeholder="Distance in KM" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} style={{ display: step === 1 ? 'block' : 'none' }}>
                <Form.Item name="vehicleNo" label="Vehicle Number" rules={[{ required: true }]}>
                  <Input placeholder="MH12AB1234" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} style={{ display: step === 1 ? 'block' : 'none' }}>
                <Form.Item name="vehicleType" label="Vehicle Type" rules={[{ required: true }]}>
                  <Select options={vehicleTypes.map((x) => ({ label: x, value: x }))} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} style={{ display: step === 1 ? 'block' : 'none' }}>
                <Form.Item name="ewayDate" label="E-Way Bill Date" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} style={{ display: step === 1 ? 'block' : 'none' }}>
                <Form.Item name="validTill" label="Valid Till" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <div className="erpFormActions">
                  {step > 0 && <Button onClick={() => setStep((prev) => prev - 1)}>Previous</Button>}
                  {step < stepConfig.length - 1 && (
                    <Button type="primary" onClick={goNext}>
                      Next
                    </Button>
                  )}
                  {step === stepConfig.length - 1 && (
                    <Button type="primary" htmlType="submit">
                      Save E-Way Bill Draft
                    </Button>
                  )}
                  <Button onClick={() => form.resetFields()}>Reset</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card className="dashboardCard mrgTop16">
          <Title level={4}>E-Way Bill Register</Title>
          <Table
            dataSource={dataSource}
            columns={[
              { title: 'Invoice', dataIndex: 'invoiceRef' },
              { title: 'Transporter', dataIndex: 'transporterName' },
              { title: 'Mode', dataIndex: 'transportMode' },
              { title: 'Vehicle', dataIndex: 'vehicleNo' },
              { title: 'Distance', dataIndex: 'distance', render: (v) => `${v} KM` },
              {
                title: 'Date',
                dataIndex: 'ewayDate',
                render: (v) => (v ? dayjs(v).format('DD MMM YYYY') : '-'),
              },
              {
                title: 'Valid Till',
                dataIndex: 'validTill',
                render: (v) => (v ? dayjs(v).format('DD MMM YYYY') : '-'),
              },
              {
                title: 'Status',
                dataIndex: 'status',
                render: (s) => <Tag className="statusBadge">{s}</Tag>,
              },
            ]}
            pagination={{ pageSize: 8 }}
          />
        </Card>
      </div>
    </ErpLayout>
  );
}
