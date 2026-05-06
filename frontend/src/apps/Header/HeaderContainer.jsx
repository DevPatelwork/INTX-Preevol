import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, Input, Layout, Tag, Select } from 'antd';
import { useEffect, useState } from 'react';

// import Notifications from '@/components/Notification';

import {
  BellOutlined,
  LogoutOutlined,
  SearchOutlined,
  SettingOutlined,
  ToolOutlined,
  UserOutlined,
  ShopOutlined,
} from '@ant-design/icons';

import { selectCurrentAdmin } from '@/redux/auth/selectors';

import { FILE_BASE_URL } from '@/config/serverApiConfig';

import useLanguage from '@/locale/useLanguage';
import storePersist from '@/redux/storePersist';
import { request } from '@/request';

export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const { Header } = Layout;
  const location = useLocation();
  const translate = useLanguage();

  const [companies, setCompanies] = useState([]);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load companies and current company on mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await request.listAll({ entity: 'company' });
        if (response.success && response.result) {
          setCompanies(response.result);
        }
      } catch (error) {
        console.error('Failed to load companies:', error);
      }
    };

    const savedCompany = storePersist.get('companyContext');
    if (savedCompany && savedCompany.currentCompany) {
      setCurrentCompany(savedCompany.currentCompany);
    } else if (currentAdmin?.currentCompany) {
      setCurrentCompany(currentAdmin.currentCompany);
      storePersist.set('companyContext', { currentCompany: currentAdmin.currentCompany });
    }

    loadCompanies();
  }, [currentAdmin]);

  // Handle company switch
  const handleCompanyChange = async (companyId) => {
    if (companyId === currentCompany) return;

    setLoading(true);
    try {
      // Update backend context
      await request.patch({
        entity: 'company-context',
        jsonData: { companyId },
      });

      // Update local storage
      storePersist.set('companyContext', { currentCompany: companyId });
      setCurrentCompany(companyId);

      // Refresh the page to load data for new company
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch company:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentCompanyName = () => {
    const company = companies.find(c => c._id === currentCompany);
    return company?.name || 'Select Company';
  };

  const pageTitleMap = {
    '/dashboard': 'Dashboard Overview',
    '/invoice': translate('invoices'),
    '/quotation': 'Quotation',
    '/proposal-workspace': 'Proposal Workspace',
    '/proposal-technical': 'Proposal Technical Form',
    '/proformainvoice': 'Proforma Invoice',
    '/serviceinvoice': 'Service Invoice',
    '/proformaserviceinvoice': 'Proforma Service',
    '/proposalhistory': 'Report',
    '/customer': translate('customers'),
    '/ewaybill': 'E-Way Bill Workspace',
    '/vendor': 'Vendor',
    '/workorder': 'Work Order',
    '/purchaseorder': 'Purchase Order',
    '/category': 'Category',
    '/subcategory': 'Sub Category',
    '/product': 'Product',
    '/company': 'Company Profile',
    '/type': 'Type',
    '/model': 'Model',
    '/plungerdia': 'Plunger Diameter',
    '/moc': 'MOC',
    '/goods': 'Goods',
    '/goodsinventory': 'Goods Inventory',
    '/poproduct': 'PO Product',
    '/payment': translate('payments'),
    '/payment/mode': translate('payments_mode'),
    '/bank': 'Bank',
    '/financialsettings': 'Financial Year',
    '/taxes': translate('taxes'),
    '/settings': translate('settings'),
    '/about': translate('about'),
    '/profile': translate('profile'),
  };

  const currentPath = location.pathname.split('/').slice(0, 2).join('/') || '/dashboard';
  const pageTitle = pageTitleMap[currentPath] || 'Dashboard Overview';

  const ProfileDropdown = () => {
    const navigate = useNavigate();
    return (
      <div className="profileDropdown" onClick={() => navigate('/profile')}>
        <Avatar
          size="large"
          className="last"
          src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
          style={{ color: '#f56a00', backgroundColor: currentAdmin?.photo ? 'none' : '#fde3cf' }}
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <div className="profileDropdownInfo">
          <p>
            {currentAdmin?.name} {currentAdmin?.surname}
          </p>
          <p>{currentAdmin?.email}</p>
        </div>
      </div>
    );
  };

  const DropdownMenu = ({ text }) => {
    return <span style={{}}>{text}</span>;
  };

  const items = [
    {
      label: <ProfileDropdown className="headerDropDownMenu" />,
      key: 'ProfileDropdown',
    },
    {
      type: 'divider',
    },
    {
      icon: <UserOutlined />,
      key: 'settingProfile',
      label: (
        <Link to={'/profile'}>
          <DropdownMenu text={translate('profile_settings')} />
        </Link>
      ),
    },
    {
      icon: <ToolOutlined />,
      key: 'settingApp',
      label: <Link to={'/settings'}>{translate('app_settings')}</Link>,
    },

    {
      type: 'divider',
    },

    {
      icon: <LogoutOutlined />,
      key: 'logout',
      label: <Link to={'/logout'}>{translate('logout')}</Link>,
    },
  ];

  return (
    <Header className="appHeader">
      <div className="appHeaderLeft">
        <div className="appHeaderHeading">
          <h2 className="appHeaderTitle">{pageTitle}</h2>
          <p className="appHeaderSubtitle">Operational workspace</p>
        </div>
        <Input
          className="appHeaderSearch"
          placeholder="Search POs or Invoices..."
          prefix={<SearchOutlined />}
        />
      </div>
      <div className="appHeaderRight">
        <Select
          loading={loading}
          value={currentCompany}
          onChange={handleCompanyChange}
          placeholder="Select Company"
          className="companySelect"
          prefix={<ShopOutlined />}
          options={companies
            .filter((company) => company._id && company.name)
            .map((company) => ({
              value: company._id,
              label: company.name,
            }))}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
        <Tag className="headerStatusTag">Pro Active</Tag>
        <Button className="headerIconBtn" icon={<BellOutlined />} />
        <Button className="headerIconBtn" icon={<SettingOutlined />} />
        <Dropdown
          menu={{
            items,
          }}
          trigger={['click']}
          placement="bottomRight"
          style={{ width: '280px', float: 'right' }}
        >
          <Avatar
            className="headerAvatar"
            src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
            style={{ color: '#f56a00', backgroundColor: currentAdmin?.photo ? 'none' : '#fde3cf' }}
            size="large"
          >
            {currentAdmin?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
        </Dropdown>
      </div>
    </Header>
  );
}

//  console.log(
//    '🚀 Welcome to Preevol ERP CRM! For customization services, contact us at support@preevol.com'
//  );
