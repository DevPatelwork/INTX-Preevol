import {
  SettingOutlined,
  CreditCardOutlined,
  DollarOutlined,
  FileImageOutlined,
  TrophyOutlined,
  ShopOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

import TabsContent from '@/components/TabsContent/TabsContent';

import CompanyLogoSettings from './CompanyLogoSettings';
import GeneralSettings from './GeneralSettings';
import CompanyCrudSettings from './CompanyCrudSettings';
import FinancialYearCrudSettings from './FinancialYearCrudSettings';
import MoneyFormatSettings from './MoneyFormatSettings';

import useLanguage from '@/locale/useLanguage';
import { useParams } from 'react-router-dom';

export default function Settings() {
  const translate = useLanguage();
  const { settingsKey } = useParams();
  const content = [
    {
      key: 'general_settings',
      label: translate('General Settings'),
      icon: <SettingOutlined />,
      children: <GeneralSettings />,
    },
    {
      key: 'company_crud',
      label: translate('Companies'),
      icon: <ShopOutlined />,
      children: <CompanyCrudSettings />,
    },
    {
      key: 'financial_year',
      label: translate('Financial Year'),
      icon: <CalendarOutlined />,
      children: <FinancialYearCrudSettings />,
    },
    {
      key: 'company_logo',
      label: translate('Company Logo'),
      icon: <FileImageOutlined />,
      children: <CompanyLogoSettings />,
    },
    {
      key: 'currency_settings',
      label: translate('Currency Settings'),
      icon: <DollarOutlined />,
      children: <MoneyFormatSettings />,
    },
  ];

  const pageTitle = translate('Settings');

  return <TabsContent defaultActiveKey={settingsKey} content={content} pageTitle={pageTitle} />;
}
