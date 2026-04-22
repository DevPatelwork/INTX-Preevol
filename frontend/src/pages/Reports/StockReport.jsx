import { useState, useEffect } from 'react';
import { Card, DatePicker, Select, Button, Table, Tag, Space, Row, Col, Typography, Badge } from 'antd';
import { SearchOutlined, PrinterOutlined, FileExcelOutlined, WarningOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import useLanguage from '@/locale/useLanguage';
import { useDate } from '@/settings';
import { request } from '@/request';

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;

export default function StockReport() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: [dayjs().startOf('month'), dayjs().endOf('month')],
    product: null,
  });

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await request.list({ entity: 'product' });
      if (response.success) {
        setProducts(response.result || []);
      }
    };
    fetchProducts();
  }, []);

  const columns = [
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      render: (_, record) => record.legacyProductId || record._id?.slice(-6).toUpperCase() || '-',
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category, record) => category || record.categoryRef?.name || '-',
    },
    {
      title: 'Sub Category',
      dataIndex: 'subCategory',
      key: 'subCategory',
      render: (subCategory, record) => subCategory || record.subCategoryRef?.name || '-',
    },
    {
      title: 'HSN/SAC',
      dataIndex: 'hsnOrSac',
      key: 'hsnOrSac',
      render: (hsnOrSac, record) => hsnOrSac || record.hsnSac || '-',
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      render: (uom) => uom || 'NOS',
    },
    {
      title: 'Opening Stock',
      dataIndex: 'openingStock',
      key: 'openingStock',
      align: 'center',
      render: (_, record) => {
        const opening = record.goods?.reduce((sum, g) => sum + (g.openingStock || 0), 0) || 0;
        return opening;
      },
    },
    {
      title: 'Receipts',
      key: 'receipts',
      align: 'center',
      render: (_, record) => {
        const receipts = record.inventory?.
          filter(inv => inv.type === 'receipt').
          reduce((sum, inv) => sum + (inv.quantity || 0), 0) || 0;
        return receipts;
      },
    },
    {
      title: 'Issues',
      key: 'issues',
      align: 'center',
      render: (_, record) => {
        const issues = record.inventory?.
          filter(inv => inv.type === 'issue').
          reduce((sum, inv) => sum + (inv.quantity || 0), 0) || 0;
        return issues;
      },
    },
    {
      title: 'Closing Stock',
      key: 'closingStock',
      align: 'center',
      render: (_, record) => {
        const opening = record.goods?.reduce((sum, g) => sum + (g.openingStock || 0), 0) || 0;
        const receipts = record.inventory?.
          filter(inv => inv.type === 'receipt').
          reduce((sum, inv) => sum + (inv.quantity || 0), 0) || 0;
        const issues = record.inventory?.
          filter(inv => inv.type === 'issue').
          reduce((sum, inv) => sum + (inv.quantity || 0), 0) || 0;
        return opening + receipts - issues;
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const opening = record.goods?.reduce((sum, g) => sum + (g.openingStock || 0), 0) || 0;
        const receipts = record.inventory?.
          filter(inv => inv.type === 'receipt').
          reduce((sum, inv) => sum + (inv.quantity || 0), 0) || 0;
        const issues = record.inventory?.
          filter(inv => inv.type === 'issue').
          reduce((sum, inv) => sum + (inv.quantity || 0), 0) || 0;
        const closing = opening + receipts - issues;
        const reorderLevel = record.goods?.[0]?.reorderLevel || 10;
        
        if (closing <= 0) {
          return <Badge status="error" text={<span style={{ color: '#ff4d4f' }}><WarningOutlined /> Out of Stock</span>} />;
        } else if (closing <= reorderLevel) {
          return <Badge status="warning" text={<span style={{ color: '#faad14' }}><WarningOutlined /> Low Stock</span>} />;
        }
        return <Badge status="success" text="In Stock" />;
      },
    },
    {
      title: 'Reorder Level',
      dataIndex: ['goods', '0', 'reorderLevel'],
      key: 'reorderLevel',
      align: 'center',
      render: (_, record) => record.goods?.[0]?.reorderLevel || 10,
    },
  ];

  const handleGetData = async () => {
    setLoading(true);
    try {
      const [startDate, endDate] = filters.dateRange || [null, null];
      
      const queryParams = {
        entity: 'product',
        options: {
          filter: filters.product ? { _id: filters.product } : {},
          populate: ['goods', 'inventory'],
        },
      };
      
      const response = await request.list(queryParams);
      if (response.success) {
        setData(response.result || []);
      }
    } catch (error) {
      console.error('Error fetching stock report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    console.log('Export to Excel');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={3}>Stock Report</Title>
        
        {/* Filter Section */}
        <Card type="inner" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <div style={{ marginBottom: 8 }}>Date Range</div>
              <RangePicker
                style={{ width: '100%' }}
                value={filters.dateRange}
                onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
                format={dateFormat}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div style={{ marginBottom: 8 }}>Product</div>
              <Select
                style={{ width: '100%' }}
                placeholder="All Products"
                allowClear
                value={filters.product}
                onChange={(value) => setFilters({ ...filters, product: value })}
                showSearch
                optionFilterProp="children"
              >
                {products.map((product) => (
                  <Option key={product._id} value={product._id}>
                    {product.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
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

        {/* Summary Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8}>
            <Card bordered={false} style={{ background: '#f6ffed' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Badge status="success" />
                <span>In Stock: {data.filter(d => {
                  const opening = d.goods?.reduce((sum, g) => sum + (g.openingStock || 0), 0) || 0;
                  const closing = opening; // Simplified calculation
                  const reorderLevel = d.goods?.[0]?.reorderLevel || 10;
                  return closing > reorderLevel;
                }).length}</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} style={{ background: '#fffbe6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Badge status="warning" />
                <span>Low Stock: {data.filter(d => {
                  const opening = d.goods?.reduce((sum, g) => sum + (g.openingStock || 0), 0) || 0;
                  const closing = opening; // Simplified calculation
                  const reorderLevel = d.goods?.[0]?.reorderLevel || 10;
                  return closing > 0 && closing <= reorderLevel;
                }).length}</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} style={{ background: '#fff2f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Badge status="error" />
                <span>Out of Stock: {data.filter(d => {
                  const opening = d.goods?.reduce((sum, g) => sum + (g.openingStock || 0), 0) || 0;
                  return opening <= 0;
                }).length}</span>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Data Table */}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} products`,
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
}
