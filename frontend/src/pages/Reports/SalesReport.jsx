import { useState, useEffect } from 'react';
import { Card, DatePicker, Select, Button, Table, Tag, Space, Row, Col, Typography } from 'antd';
import { SearchOutlined, PrinterOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import useLanguage from '@/locale/useLanguage';
import { useMoney, useDate } from '@/settings';
import { request } from '@/request';

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;

export default function SalesReport() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { moneyFormatter } = useMoney();
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [parties, setParties] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: [dayjs().startOf('month'), dayjs().endOf('month')],
    party: null,
    invoiceType: null,
  });

  // Fetch parties for dropdown
  useEffect(() => {
    const fetchParties = async () => {
      const response = await request.list({ entity: 'client' });
      if (response.success) {
        setParties(response.result || []);
      }
    };
    fetchParties();
  }, []);

  const columns = [
    {
      title: 'Invoice No',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format(dateFormat),
    },
    {
      title: 'Party Name',
      dataIndex: ['receiver', 'name'],
      key: 'partyName',
      render: (_, record) => record.receiverName || record.receiver?.name || '-',
    },
    {
      title: 'Product',
      dataIndex: ['items', '0', 'itemName'],
      key: 'product',
      render: (_, record) => {
        const items = record.items || [];
        if (items.length === 0) return '-';
        if (items.length === 1) return items[0].itemName;
        return `${items[0].itemName} +${items.length - 1} more`;
      },
    },
    {
      title: 'HSN Code',
      dataIndex: ['items', '0', 'hsnSac'],
      key: 'hsn',
      render: (_, record) => record.items?.[0]?.hsnSac || '-',
    },
    {
      title: 'Qty',
      dataIndex: ['items', '0', 'quantity'],
      key: 'qty',
      align: 'center',
      render: (_, record) => {
        const totalQty = record.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
        return totalQty;
      },
    },
    {
      title: 'Taxable Value',
      key: 'taxableValue',
      align: 'right',
      render: (_, record) => moneyFormatter({ amount: record.totalAmountBeforeTax || 0 }),
    },
    {
      title: 'CGST',
      key: 'cgst',
      align: 'right',
      render: (_, record) => moneyFormatter({ amount: record.cgstTotal || 0 }),
    },
    {
      title: 'SGST',
      key: 'sgst',
      align: 'right',
      render: (_, record) => moneyFormatter({ amount: record.sgstTotal || 0 }),
    },
    {
      title: 'IGST',
      key: 'igst',
      align: 'right',
      render: (_, record) => moneyFormatter({ amount: record.igstTotal || 0 }),
    },
    {
      title: 'Total Tax',
      key: 'totalTax',
      align: 'right',
      render: (_, record) => moneyFormatter({ amount: record.totalGstTax || 0 }),
    },
    {
      title: 'Grand Total',
      key: 'grandTotal',
      align: 'right',
      render: (_, record) => (
        <strong>{moneyFormatter({ amount: record.grandTotal || 0 })}</strong>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'paid' ? 'green' : 
          status === 'sent' ? 'blue' : 
          status === 'overdue' ? 'red' : 
          status === 'draft' ? 'default' : 'orange'
        }>
          {status?.toUpperCase() || 'DRAFT'}
        </Tag>
      ),
    },
  ];

  const handleGetData = async () => {
    setLoading(true);
    try {
      const [startDate, endDate] = filters.dateRange || [null, null];
      
      const queryParams = {
        entity: 'invoice',
        options: {
          filter: {
            date: {
              $gte: startDate?.toISOString(),
              $lte: endDate?.toISOString(),
            },
            ...(filters.party && { receiver: filters.party }),
            ...(filters.invoiceType && { invoiceType: filters.invoiceType }),
          },
          sort: { date: -1 },
        },
      };
      
      const response = await request.list(queryParams);
      if (response.success) {
        setData(response.result || []);
      }
    } catch (error) {
      console.error('Error fetching sales report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Export to Excel logic would go here
    console.log('Export to Excel');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={3}>Sales Report</Title>
        
        {/* Filter Section */}
        <Card type="inner" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 8 }}>Date Range</div>
              <RangePicker
                style={{ width: '100%' }}
                value={filters.dateRange}
                onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
                format={dateFormat}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 8 }}>Party Name</div>
              <Select
                style={{ width: '100%' }}
                placeholder="All Parties"
                allowClear
                value={filters.party}
                onChange={(value) => setFilters({ ...filters, party: value })}
                showSearch
                optionFilterProp="children"
              >
                {parties.map((party) => (
                  <Option key={party._id} value={party._id}>
                    {party.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 8 }}>Invoice Type</div>
              <Select
                style={{ width: '100%' }}
                placeholder="All Types"
                allowClear
                value={filters.invoiceType}
                onChange={(value) => setFilters({ ...filters, invoiceType: value })}
              >
                <Option value="Sales Invoice">Sales Invoice</Option>
                <Option value="Service Invoice">Service Invoice</Option>
                <Option value="SEZ Sales Invoice">SEZ Sales Invoice</Option>
                <Option value="Export Sales Invoice">Export Sales Invoice</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 8 }}>&nbsp;</div>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleGetData}
                  loading={loading}
                >
                  Get Data
                </Button>
                <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                  Print
                </Button>
                <Button icon={<FileExcelOutlined />} onClick={handleExport}>
                  Export
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Data Table */}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} records`,
          }}
          scroll={{ x: 'max-content' }}
          summary={() => {
            const totalTaxable = data.reduce((sum, item) => sum + (item.totalAmountBeforeTax || 0), 0);
            const totalCGST = data.reduce((sum, item) => sum + (item.cgstTotal || 0), 0);
            const totalSGST = data.reduce((sum, item) => sum + (item.sgstTotal || 0), 0);
            const totalIGST = data.reduce((sum, item) => sum + (item.igstTotal || 0), 0);
            const totalTax = data.reduce((sum, item) => sum + (item.totalGstTax || 0), 0);
            const totalGrand = data.reduce((sum, item) => sum + (item.grandTotal || 0), 0);

            return (
              <Table.Summary.Row style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
                <Table.Summary.Cell index={0} colSpan={6}>
                  TOTAL
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="right">
                  {moneyFormatter({ amount: totalTaxable })}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} align="right">
                  {moneyFormatter({ amount: totalCGST })}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8} align="right">
                  {moneyFormatter({ amount: totalSGST })}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9} align="right">
                  {moneyFormatter({ amount: totalIGST })}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={10} align="right">
                  {moneyFormatter({ amount: totalTax })}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={11} align="right">
                  {moneyFormatter({ amount: totalGrand })}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={12} />
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </div>
  );
}
