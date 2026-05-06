import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';

import { useAppContext } from '@/context/appContext';

import logoIcon from '@/style/Resources/mct_intex_logo_1_gSz_icon.ico';

import useResponsive from '@/hooks/useResponsive';

import {
  ContainerOutlined,
  FileSyncOutlined,
  MenuOutlined,
  ShopOutlined,
  AppstoreOutlined,
  TeamOutlined,
  FileTextOutlined,
  SolutionOutlined,
  DatabaseOutlined,
  BuildOutlined,
  ToolOutlined,
  ClusterOutlined,
  TagsOutlined,
  BarChartOutlined,
  ShoppingOutlined,
  BankOutlined,
  UserOutlined,
  ColumnHeightOutlined,
  ThunderboltOutlined,
  HomeOutlined,
  ApartmentOutlined,
  ProfileOutlined,
  StockOutlined,
  FileProtectOutlined,
  FileDoneOutlined,
  LineChartOutlined,
  FileSearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function Navigation() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={true} />;
}

function Sidebar({ collapsible, isMobile = false }) {
  let location = useLocation();

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [currentPath, setCurrentPath] = useState(location.pathname.slice(1));
  const [openKeys, setOpenKeys] = useState([]);
  const [collapsed, setCollapsed] = useState(isNavMenuClose);

  const navigate = useNavigate();

  const items = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: <Link to={'/dashboard'}>Dashboard</Link>,
    },
    // MASTER DATA
    {
      key: 'masterdata',
      icon: <AppstoreOutlined />,
      label: 'Master Data',
      children: [
        {
          key: 'customer',
          icon: <TeamOutlined />,
          label: <Link to={'/customer'}>Party</Link>,
        },
        {
          key: 'vendor',
          icon: <TeamOutlined />,
          label: <Link to={'/vendor'}>Vendor</Link>,
        },
        {
          key: 'category',
          icon: <ClusterOutlined />,
          label: <Link to={'/category'}>Category</Link>,
        },
        {
          key: 'subcategory',
          icon: <TagsOutlined />,
          label: <Link to={'/subcategory'}>Sub Category</Link>,
        },
        {
          key: 'product',
          icon: <ContainerOutlined />,
          label: <Link to={'/product'}>Product</Link>,
        },
        {
          key: 'poproduct',
          icon: <ShoppingOutlined />,
          label: <Link to={'/poproduct'}>Purchase Product</Link>,
        },
        {
          key: 'goods',
          icon: <DatabaseOutlined />,
          label: <Link to={'/goods'}>Goods</Link>,
        },
        {
          key: 'bank',
          icon: <BankOutlined />,
          label: <Link to={'/bank'}>Bank Details</Link>,
        },
        {
          key: 'user',
          icon: <UserOutlined />,
          label: <Link to={'/user'}>User</Link>,
        },
        {
          key: 'company',
          icon: <ShopOutlined />,
          label: <Link to={'/company'}>Company Profile</Link>,
        },
        {
          key: 'type',
          icon: <BuildOutlined />,
          label: <Link to={'/type'}>Type</Link>,
        },
        {
          key: 'model',
          icon: <ToolOutlined />,
          label: <Link to={'/model'}>Model</Link>,
        },
        {
          key: 'plungerdia',
          icon: <ColumnHeightOutlined />,
          label: <Link to={'/plungerdia'}>Plunger Diameter</Link>,
        },
      ],
    },
    // TRANSACTIONS
    {
      key: 'transactions',
      icon: <FileTextOutlined />,
      label: 'Transactions',
      children: [
        {
          key: 'invoice',
          icon: <ContainerOutlined />,
          label: <Link to={'/invoice'}>Invoice</Link>,
        },
        {
          key: 'purchaseorder',
          icon: <ShoppingOutlined />,
          label: <Link to={'/purchaseorder'}>Purchase Order</Link>,
        },
        {
          key: 'workorder',
          icon: <FileSyncOutlined />,
          label: <Link to={'/workorder'}>Work Order</Link>,
        },
        {
          key: 'serviceinvoice',
          icon: <FileSyncOutlined />,
          label: <Link to={'/serviceinvoice'}>Service Invoice</Link>,
        },
        {
          key: 'proformainvoice',
          icon: <SolutionOutlined />,
          label: <Link to={'/proformainvoice'}>Proforma Invoice</Link>,
        },
        {
          key: 'quotation',
          icon: <FileProtectOutlined />,
          label: <Link to={'/quotation'}>Create Proposal</Link>,
        },
        {
          key: 'proposalworkspace',
          icon: <ProfileOutlined />,
          label: <Link to={'/proposal-technical'}>Proposal Technical Form</Link>,
        },
        {
          key: 'ewaybill',
          icon: <FileDoneOutlined />,
          label: <Link to={'/ewaybill'}>E-Way Bill</Link>,
        },
        {
          key: 'goodsinventory',
          icon: <StockOutlined />,
          label: <Link to={'/goodsinventory'}>Inventory Management</Link>,
        },
      ],
    },
    // REPORTS
    {
      key: 'reports',
      icon: <LineChartOutlined />,
      label: 'Reports',
      children: [
        {
          key: 'salesreport',
          icon: <BarChartOutlined />,
          label: <Link to={'/salesreport'}>Sales Report</Link>,
        },
        {
          key: 'servicereport',
          icon: <FileSearchOutlined />,
          label: <Link to={'/servicereport'}>Service Report</Link>,
        },
        {
          key: 'stockreport',
          icon: <DatabaseOutlined />,
          label: <Link to={'/stockreport'}>Stock Report</Link>,
        },
        {
          key: 'proposalhistory',
          icon: <ApartmentOutlined />,
          label: <Link to={'/proposalhistory'}>Proposal History</Link>,
        },
      ],
    },
    // SETTINGS
    {
      key: 'settingsmenu',
      icon: <SettingOutlined />,
      label: 'Settings',
      children: [
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: <Link to={'/settings'}>Application Settings</Link>,
        },
        {
          key: 'financialsettings',
          icon: <BankOutlined />,
          label: <Link to={'/financialsettings'}>Financial Year</Link>,
        },
        {
          key: 'about',
          icon: <SolutionOutlined />,
          label: <Link to={'/about'}>About</Link>,
        },
      ],
    },
  ];

  useEffect(() => {
    if (location)
      if (currentPath !== location.pathname) {
        if (location.pathname === '/') {
          setCurrentPath('dashboard');
        } else setCurrentPath(location.pathname.slice(1));
      }
  }, [location, currentPath]);

  const onCollapse = (value) => {
    setCollapsed(value);
    if (value) {
      setOpenKeys([]);
    }
    navMenu.collapse();
  };

  const handleOpenChange = (keys) => {
    // Accordion behavior: only one submenu open at a time
    // If opening a new key, keep only the last one; if closing, allow empty
    setOpenKeys(keys.length > 0 ? [keys[keys.length - 1]] : []);
  };

  return (
    <Sider
      collapsible={collapsible}
      collapsed={collapsed}
      onCollapse={onCollapse}
      className={`navigation ${isMobile ? 'navigation-mobile' : 'navigation-desktop'} ${collapsed ? 'navigation-collapsed' : ''}`}
      width={256}
      collapsedWidth={80}
      theme={'light'}
    >
      <div
        className={`logo ${collapsed ? 'logo-collapsed' : ''}`}
        onClick={() => navigate('/dashboard')}
      >
        <img src={logoIcon} alt="Logo" className="logoIcon" />
        <div className={`logoBrandWrap ${collapsed ? 'logoBrandWrap-hidden' : ''}`}>
          <span className="logoBrand">Preevol technics</span>
          <span className="logoSubBrand">Precision Ledger</span>
        </div>
      </div>
      <Menu
        className={`navigationMenu ${collapsed ? 'navigationMenu-collapsed' : ''}`}
        items={items}
        mode="inline"
        inlineCollapsed={collapsed}
        theme={'light'}
        selectedKeys={[currentPath]}
        openKeys={collapsed ? [] : openKeys}
        onOpenChange={handleOpenChange}
      />
      {!collapsed && (
        <div className="navigationFooterCard">
          <div className="navigationFooterIcon">
            <ThunderboltOutlined />
          </div>
          <div className="navigationFooterText">
            <strong>Upgrade to Pro</strong>
            <span>Advanced insights and automated reports.</span>
          </div>
          <Button type="primary" block size="small">
            Upgrade
          </Button>
        </div>
      )}
    </Sider>
  );
}

function MobileSidebar() {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        type="text"
        size="large"
        onClick={showDrawer}
        className="mobile-sidebar-btn"
      >
        <MenuOutlined style={{ fontSize: 18 }} />
      </Button>
      <Drawer
        width={250}
        // style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
        placement={'left'}
        closable={false}
        onClose={onClose}
        open={visible}
      >
        <Sidebar collapsible={false} isMobile={true} />
      </Drawer>
    </>
  );
}
