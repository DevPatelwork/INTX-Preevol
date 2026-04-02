import { Form } from 'antd';
import { TextField, MenuItem } from '@mui/material';

import useLanguage from '@/locale/useLanguage';

export default function GeneralSettingForm() {
  const translate = useLanguage();
  const dateFormats = [
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'DD-MM-YYYY',
    'DD.MM.YYYY',
    'YYYY/MM/DD',
    'YYYY-DD-MM',
    'YYYY.MM.DD',
    'MM/YYYY/DD',
    'MM.DD.YYYY',
    'DD/YYYY/MM',
    'DD-YYYY-MM',
    'DD.YYYY.MM',
    'YYYY/DD/MM',
    'YYYY-MM-DD',
    'MM.DD.YY',
    'DD-MMM-YY',
    'YY/MM/DD',
    'DD MMM YYYY',
    'MMM DD, YYYY',
    'DD-MM-YY',
    'MM-DD-YY',
    'YY.MM.DD',
    'MMM DD YY',
    'DD MMM YY',
    'MM.YYYY.DD',
    'YY/DD/MM',
    'MM-DD',
    'DD-MM',
    'MM/YY',
    'YYYY-MMM-DD',
    'MM/DD',
    'DD.MM.YY',
    'MM/YY/DD',
    'MMMM DD, YYYY',
    'DD MMMM YYYY',
    'MM-YY-DD',
    'MMM. DD, YY',
    'YYYY MM DD',
    'YY-MM-DD',
  ];

  return (
    <div>
      <Form.Item
        label={translate('Date Format')}
        name="app_date_format"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <TextField select fullWidth size="small">
          {dateFormats.map((format) => (
            <MenuItem key={format} value={format}>
              {format}
            </MenuItem>
          ))}
        </TextField>
      </Form.Item>
      <Form.Item
        label={translate('email')}
        name="app_company_email"
        rules={[
          {
            required: true,
            type: 'email',
          },
        ]}
      >
        <TextField fullWidth size="small" type="email" />
      </Form.Item>
    </div>
  );
}
