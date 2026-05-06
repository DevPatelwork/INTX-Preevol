import { Card, Col, Divider, Row, Space, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import {
  BankOutlined,
  DatabaseOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const blocks = {
  ewaybill: {
    title: 'E-Way Bill Workspace',
    subtitle: 'Generate and manage transport compliance details',
    icon: <FileDoneOutlined />,
    modules: [
      { label: 'Invoice Register', to: '/invoice' },
      { label: 'Service Invoice Register', to: '/serviceinvoice' },
      { label: 'Party Master', to: '/customer' },
    ],
    points: [
      'Validate transporter details and vehicle information',
      'Track IRN / Ack / E-Way Bill reference lifecycle',
      'Prepare dispatch data before final GST portal upload',
    ],
  },
  proposal: {
    title: 'Proposal Workspace',
    subtitle: 'Build technical-commercial proposals in one flow',
    icon: <FileProtectOutlined />,
    modules: [
      { label: 'Quotation Register', to: '/quotation' },
      { label: 'Proposal History', to: '/proposalhistory' },
      { label: 'Product Master', to: '/product' },
    ],
    points: [
      'Capture pump model, application, pressure, and discharge specs',
      'Add scope-of-supply and delivery commitments',
      'Finalize pricing, discount, and terms before issue',
    ],
  },
};

export default function OperationsWorkspace({ type = 'ewaybill' }) {
  const data = blocks[type] || blocks.ewaybill;

  const quickGroups = [
    {
      title: 'Master Data',
      icon: <TeamOutlined />,
      links: [
        { label: 'Party', to: '/customer' },
        { label: 'Vendor', to: '/vendor' },
        { label: 'Company Profile', to: '/company' },
      ],
    },
    {
      title: 'Transactions',
      icon: <FileTextOutlined />,
      links: [
        { label: 'Invoice', to: '/invoice' },
        { label: 'Purchase Order', to: '/purchaseorder' },
        { label: 'Work Order', to: '/workorder' },
      ],
    },
    {
      title: 'Controls',
      icon: <SettingOutlined />,
      links: [
        { label: 'Financial Year', to: '/financialsettings' },
        { label: 'Settings', to: '/settings' },
        { label: 'Stock Report', to: '/stockreport' },
      ],
    },
  ];

  return (
    <div className="dashboardV2">
      <Card className="dashboardCard">
        <Space size={12} align="center" style={{ marginBottom: 8 }}>
          <span className="summaryIcon blue">{data.icon}</span>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              {data.title}
            </Title>
            <Paragraph style={{ margin: 0, color: 'var(--on-surface-muted)' }}>{data.subtitle}</Paragraph>
          </div>
        </Space>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            <Title level={5}>Operational Checklist</Title>
            <Space direction="vertical" size={8}>
              {data.points.map((point) => (
                <Text key={point}>- {point}</Text>
              ))}
            </Space>
          </Col>
          <Col xs={24} lg={10}>
            <Title level={5}>Primary Modules</Title>
            <Space wrap>
              {data.modules.map((module) => (
                <Link key={module.to} to={module.to}>
                  <Tag className="statusBadge">{module.label}</Tag>
                </Link>
              ))}
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} className="mrgTop16">
        {quickGroups.map((group) => (
          <Col xs={24} md={8} key={group.title}>
            <Card className="dashboardCard" title={<Space>{group.icon}{group.title}</Space>}>
              <Space direction="vertical" size={10}>
                {group.links.map((item) => (
                  <Link key={item.to} to={item.to}>
                    <Tag>{item.label}</Tag>
                  </Link>
                ))}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mrgTop16">
        <Col xs={24} md={12}>
          <Card className="dashboardCard" title={<Space><DatabaseOutlined />Data Readiness</Space>}>
            <Paragraph>
              Ensure product catalog, GST rates, and party tax details are up to date before processing
              any transaction batch.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="dashboardCard" title={<Space><BankOutlined />Compliance</Space>}>
            <Paragraph>
              Use this workspace to drive a compliant process from document creation to reporting and
              audit-friendly export outputs.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
