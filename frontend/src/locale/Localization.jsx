import { ConfigProvider } from 'antd';

export default function Localization({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#004ac6',
          colorLink: '#004ac6',
          borderRadius: 12,
          colorBgBase: '#f7f9fb',
          colorBgLayout: '#f7f9fb',
          colorBgContainer: '#ffffff',
          colorBorder: 'rgba(195, 198, 215, 0.15)',
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          fontFamilyCode: "'Inter', 'Segoe UI', sans-serif",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
