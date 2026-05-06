import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Steps,
  Table,
  Tag,
  Typography,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ErpLayout } from '@/layout';

const { Title, Text } = Typography;

const pumpTypes = ['Plunger Pump', 'Booster Pump', 'Hydro Test Pump', 'Custom Pump'];
const pumpModels = ['P-100', 'P-150', 'P-200', 'P-300'];
const defaultScope = [
  'Pump Assembly with skid',
  'Motor and coupling',
  'Control panel',
  'Commissioning support',
];

const stepConfig = [
  {
    title: 'Basic Info',
    fields: ['company', 'party', 'application'],
  },
  {
    title: 'Pump Specs',
    fields: [
      'pumpType',
      'pumpModel',
      'dischargeCapacity',
      'dischargePressure',
      'pumpSpm',
      'blockMaterial',
      'valveAssembly',
      'plungerMaterial',
    ],
  },
  {
    title: 'Commercial',
    fields: ['inletOutlet', 'suctionPressure', 'driveDetails', 'deliveryTime', 'price', 'discount', 'scopeSupply'],
  },
];

export default function ProposalTechnicalPage() {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [rows, setRows] = useState([]);
  const [scopeItems, setScopeItems] = useState(defaultScope);
  const [newScope, setNewScope] = useState('');

  const onAddScope = () => {
    if (!newScope.trim()) return;
    setScopeItems((prev) => [...prev, newScope.trim()]);
    setNewScope('');
  };

  const onFinish = (values) => {
    const amount = Number(values.price || 0);
    const discount = Number(values.discount || 0);
    const finalAmount = amount - (amount * discount) / 100;
    setRows((prev) => [
      {
        ...values,
        key: `${values.party}-${prev.length + 1}`,
        finalAmount,
      },
      ...prev,
    ]);
    setStep(0);
    form.resetFields();
  };

  const goNext = async () => {
    await form.validateFields(stepConfig[step].fields);
    setStep((prev) => Math.min(prev + 1, stepConfig.length - 1));
  };

  const tableData = useMemo(() => rows, [rows]);

  return (
    <ErpLayout>
      <div className="dashboardV2">
        <Card className="dashboardCard">
          <Title level={3}>Proposal Technical Form</Title>
          <Text type="secondary">
            Define pump specs, commercial values, and scope of supply to generate a technical-commercial proposal.
          </Text>

          <Form form={form} layout="vertical" onFinish={onFinish} className="erpFormWrapper" style={{ marginTop: 20 }}>
            <Steps
              current={step}
              size="small"
              items={stepConfig.map((item) => ({ title: item.title }))}
              style={{ marginBottom: 20 }}
            />
            <Row gutter={[16, 0]}>
              <Col xs={24} md={8} style={{ display: step === 0 ? 'block' : 'none' }}>
                <Form.Item name="company" label="Company" rules={[{ required: true }]}>
                  <Input placeholder="Issuing company" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} style={{ display: step === 0 ? 'block' : 'none' }}>
                <Form.Item name="party" label="Party" rules={[{ required: true }]}>
                  <Input placeholder="Customer name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8} style={{ display: step === 0 ? 'block' : 'none' }}>
                <Form.Item name="application" label="Application" rules={[{ required: true }]}>
                  <Input placeholder="Pump application" />
                </Form.Item>
              </Col>

              <Col xs={24} md={6} style={{ display: step === 1 ? 'block' : 'none' }}>
                <Form.Item name="pumpType" label="Pump Type" rules={[{ required: true }]}>
                  <Select options={pumpTypes.map((x) => ({ label: x, value: x }))} />
                </Form.Item>
              </Col>
              <Col xs={24} md={6} style={{ display: step === 1 ? 'block' : 'none' }}>
                <Form.Item name="pumpModel" label="Pump Model" rules={[{ required: true }]}>
                  <Select options={pumpModels.map((x) => ({ label: x, value: x }))} />
                </Form.Item>
              </Col>
              <Col xs={24} md={6} style={{ display: step === 1 ? 'block' : 'none' }}>
                <Form.Item name="dischargeCapacity" label="Discharge Capacity">
                  <Input placeholder="e.g. 15 m3/hr" />
                </Form.Item>
              </Col>
              <Col xs={24} md={6} style={{ display: step === 1 ? 'block' : 'none' }}>
                <Form.Item name="dischargePressure" label="Discharge Pressure">
                  <Input placeholder="e.g. 350 bar" />
                </Form.Item>
              </Col>

              <Col xs={24} md={6} style={{ display: step === 1 ? 'block' : 'none' }}>
                <Form.Item name="pumpSpm" label="Pump SPM">
                  <Input placeholder="Strokes per minute" />
                </Form.Item>
              </Col>
              <Col xs={24} md={6} style={{ display: step === 1 ? 'block' : 'none' }}>
                <Form.Item name="blockMaterial" label="Block Material">
                  <Input placeholder="Block MOC" />
                </Form.Item>
              </Col>
              <Col xs={24} md={6} style={{ display: step === 1 ? 'block' : 'none' }}>
                <Form.Item name="valveAssembly" label="Valve Assembly">
                  <Input placeholder="Valve details" />
                </Form.Item>
              </Col>
              <Col xs={24} md={6} style={{ display: step === 1 ? 'block' : 'none' }}>
                <Form.Item name="plungerMaterial" label="Plunger Material">
                  <Input placeholder="Plunger MOC" />
                </Form.Item>
              </Col>

              <Col xs={24} md={6} style={{ display: step === 2 ? 'block' : 'none' }}>
                <Form.Item name="inletOutlet" label="Inlet / Outlet">
                  <Input placeholder="Connection size" />
                </Form.Item>
              </Col>
              <Col xs={24} md={6} style={{ display: step === 2 ? 'block' : 'none' }}>
                <Form.Item name="suctionPressure" label="Suction Pressure">
                  <Input placeholder="Suction pressure" />
                </Form.Item>
              </Col>
              <Col xs={24} md={6} style={{ display: step === 2 ? 'block' : 'none' }}>
                <Form.Item name="driveDetails" label="Drive Details">
                  <Input placeholder="Motor / drive info" />
                </Form.Item>
              </Col>
              <Col xs={24} md={6} style={{ display: step === 2 ? 'block' : 'none' }}>
                <Form.Item name="deliveryTime" label="Delivery Time">
                  <Input placeholder="9-10 weeks from PO & advance" />
                </Form.Item>
              </Col>

              <Col xs={24} md={6} style={{ display: step === 2 ? 'block' : 'none' }}>
                <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                  <InputNumber className="w-full" min={0} />
                </Form.Item>
              </Col>
              <Col xs={24} md={6} style={{ display: step === 2 ? 'block' : 'none' }}>
                <Form.Item name="discount" label="Discount (%)" initialValue={0}>
                  <InputNumber className="w-full" min={0} max={100} />
                </Form.Item>
              </Col>

              <Col xs={24} style={{ display: step === 2 ? 'block' : 'none' }}>
                <Card size="small" title="Scope of Supply">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Form.Item name="scopeSupply" noStyle>
                      <Checkbox.Group style={{ display: 'grid', gap: 8 }}>
                        {scopeItems.map((item) => (
                          <Checkbox key={item} value={item}>
                            {item}
                          </Checkbox>
                        ))}
                      </Checkbox.Group>
                    </Form.Item>
                    <Space>
                      <Input
                        value={newScope}
                        onChange={(e) => setNewScope(e.target.value)}
                        placeholder="Add custom scope item"
                      />
                      <Button icon={<PlusOutlined />} onClick={onAddScope}>
                        Add Scope
                      </Button>
                    </Space>
                  </Space>
                </Card>
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
                      Save Proposal Draft
                    </Button>
                  )}
                  <Button onClick={() => form.resetFields()}>Reset</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card className="dashboardCard mrgTop16">
          <Title level={4}>Proposal Register</Title>
          <Table
            dataSource={tableData}
            columns={[
              { title: 'Party', dataIndex: 'party' },
              { title: 'Pump Type', dataIndex: 'pumpType' },
              { title: 'Model', dataIndex: 'pumpModel' },
              { title: 'Application', dataIndex: 'application' },
              {
                title: 'Scope Items',
                dataIndex: 'scopeSupply',
                render: (items = []) =>
                  items.map((x) => (
                    <Tag key={x} className="statusBadge">
                      {x}
                    </Tag>
                  )),
              },
              {
                title: 'Final Amount',
                dataIndex: 'finalAmount',
                render: (v) => `Rs ${Number(v || 0).toLocaleString('en-IN')}`,
              },
            ]}
            pagination={{ pageSize: 8 }}
          />
        </Card>
      </div>
    </ErpLayout>
  );
}
