import { Button, Badge } from 'antd';

// import Notifications from '@/components/Notification';

import { RocketOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function UpgradeButton() {
  const translate = useLanguage();

  return (
    <Badge count={1} size="small">
      <Button
        className="upgradeButton"
        type="primary"
        icon={<RocketOutlined />}
        onClick={() => {
          window.open(`https://preevoltechnics.com`);
        }}
      >
        {translate('Try Entreprise Version')}
      </Button>
    </Badge>
  );
}

console.log(
  'Welcome to Preevol Technics ERP CRM.'
);
