import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';

import { useAppContext } from '@/context/appContext';

import useLanguage from '@/locale/useLanguage';
import logoIcon from '@/style/Resources/mct_intex_logo_1_gSz_icon.ico';

import useResponsive from '@/hooks/useResponsive';

import {
  SettingOutlined,
  CustomerServiceOutlined,
  ContainerOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  CreditCardOutlined,
  MenuOutlined,
  ShopOutlined,
  WalletOutlined,
  ReconciliationOutlined,
  AppstoreOutlined,
  TeamOutlined,
  FileTextOutlined,
  DollarOutlined,
  SolutionOutlined,
  DatabaseOutlined,
  BuildOutlined,
  ToolOutlined,
  ClusterOutlined,
  TagsOutlined,
  FundOutlined,
  BarChartOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  BankOutlined,
  CalendarOutlined,
  UserOutlined,
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

  const translate = useLanguage();
  const navigate = useNavigate();

  const items = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to={'/dashboard'}>{translate('dashboard')}</Link>,
    },
    
    // MASTER DATA MENU
    {
      key: 'masterData',
      icon: <AppstoreOutlined />,
      label: 'Master Data',
      children: [
        {
          key: 'client',
          icon: <TeamOutlined />,
          label: <Link to={'/client'}>Party (Customers)</Link>,
        },
        {
          key: 'vendor',
          icon: <TeamOutlined />,
          label: <Link to={'/vendor'}>Vendor (Suppliers)</Link>,
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
          label: <Link to={'/goods'}>Goods / Inventory</Link>,
        },
        {
          key: 'bank',
          icon: <BankOutlined />,
          label: <Link to={'/bank'}>Bank Details</Link>,
        },
        {
          key: 'user',
          icon: <UserOutlined />,
          label: <Link to={'/user'}>User Management</Link>,
        },
        {
          key: 'company',
          icon: <ShopOutlined />,
          label: <Link to={'/company'}>Company Profile</Link>,
        },
        {
          key: 'type',
          icon: <BuildOutlined />,
          label: <Link to={'/type'}>Type Master</Link>,
        },
        {
          key: 'model',
          icon: <ToolOutlined />,
          label: <Link to={'/model'}>Model Master</Link>,
        },
        {
          key: 'plungerdia',
          icon: <AppstoreOutlined />,
          label: <Link to={'/plungerdia'}>Plunger Diameter</Link>,
        },
        {
          key: 'moc',
          icon: <ContainerOutlined />,
          label: <Link to={'/moc'}>MOC</Link>,
        },
      ],
    },
    
    // TRANSACTION MENU
    {
      key: 'transaction',
      icon: <FileTextOutlined />,
      label: 'Transaction',
      children: [
        {
          key: 'invoice',
          icon: <ContainerOutlined />,
          label: <Link to={'/invoice'}>Invoice</Link>,
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
          key: 'proformaserviceinvoice',
          icon: <SolutionOutlined />,
          label: <Link to={'/proformaserviceinvoice'}>Proforma Service</Link>,
        },
        {
          key: 'quotation',
          icon: <FileTextOutlined />,
          label: <Link to={'/quotation'}>Quotation / Proposal</Link>,
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
          key: 'goodsinventory',
          icon: <DatabaseOutlined />,
          label: <Link to={'/goodsinventory'}>Inventory Management</Link>,
        },
      ],
    },
    
    // REPORT MENU
    {
      key: 'reports',
      icon: <FundOutlined />,
      label: 'Reports',
      children: [
        {
          key: 'salesreport',
          icon: <BarChartOutlined />,
          label: <Link to={'/salesreport'}>Sales Report</Link>,
        },
        {
          key: 'servicereport',
          icon: <BarChartOutlined />,
          label: <Link to={'/servicereport'}>Service Report</Link>,
        },
        {
          key: 'stockreport',
          icon: <DatabaseOutlined />,
          label: <Link to={'/stockreport'}>Stock Report</Link>,
        },
        {
          key: 'proposalhistory',
          icon: <FileTextOutlined />,
          label: <Link to={'/proposalhistory'}>Proposal History</Link>,
        },
      ],
    },
    
    // FINANCE MENU
    {
      key: 'finance',
      icon: <DollarOutlined />,
      label: 'Finance',
      children: [
        {
          key: 'payment',
          icon: <CreditCardOutlined />,
          label: <Link to={'/payment'}>{translate('payments')}</Link>,
        },
        {
          key: 'paymentMode',
          label: <Link to={'/payment/mode'}>{translate('payments_mode')}</Link>,
          icon: <WalletOutlined />,
        },
        {
          key: 'taxes',
          label: <Link to={'/taxes'}>{translate('taxes')}</Link>,
          icon: <ShopOutlined />,
        },
        {
          key: 'financialsettings',
          icon: <CalendarOutlined />,
          label: <Link to={'/financialsettings'}>Financial Year</Link>,
        },
      ],
    },
    
    // SETTINGS MENU
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      children: [
        {
          key: 'generalSettings',
          label: <Link to={'/settings'}>{translate('settings')}</Link>,
          icon: <SettingOutlined />,
        },
        {
          key: 'about',
          label: <Link to={'/about'}>{translate('about')}</Link>,
          icon: <ReconciliationOutlined />,
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
        theme={'light'}
        selectedKeys={[currentPath]}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
      />
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
