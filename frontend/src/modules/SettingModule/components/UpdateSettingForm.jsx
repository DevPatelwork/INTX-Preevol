import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { settingsAction } from '@/redux/settings/actions';
import { selectSettings } from '@/redux/settings/selectors';

import { Form } from 'antd';
import { Button, Stack } from '@mui/material';
import Loading from '@/components/Loading';
import useLanguage from '@/locale/useLanguage';
import { notification } from 'antd';

export default function UpdateSettingForm({ config, children, withUpload, uploadSettingKey }) {
  let { entity, settingsCategory } = config;
  const dispatch = useDispatch();
  const { result, isLoading } = useSelector(selectSettings);
  const translate = useLanguage();
  const [form] = Form.useForm();

  const onSubmit = (fieldsValue) => {
    console.log('🚀 ~ onSubmit ~ fieldsValue:', fieldsValue);
    if (withUpload) {
      if (fieldsValue.file) {
        fieldsValue.file = fieldsValue.file[0].originFileObj;
      } else {
        notification.error({
          message: translate('Please select a file to upload.'),
        });
        return;
      }
      dispatch(
        settingsAction.upload({ entity, settingKey: uploadSettingKey, jsonData: fieldsValue })
      );
    } else {
      const settings = [];

      for (const [key, value] of Object.entries(fieldsValue)) {
        settings.push({ settingKey: key, settingValue: value });
      }

      dispatch(settingsAction.updateMany({ entity, jsonData: { settings } }));
    }
  };

  useEffect(() => {
    const current = result[settingsCategory];

    form.setFieldsValue(current);
  }, [result]);

  return (
    <div>
      <Loading isLoading={isLoading}>
        <Form
          form={form}
          onFinish={onSubmit}
          // onValuesChange={handleValuesChange}
          labelCol={{ span: 6 }}
          labelAlign="left"
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 980 }}
        >
          {children}
          <Form.Item>
            <Stack direction="row" spacing={1.5}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 2.4,
                  fontWeight: 600,
                }}
              >
                {translate('Save')}
              </Button>
              {/* Keep a second action slot for future reset/cancel controls */}
              <Button
                type="button"
                variant="outlined"
                sx={{ textTransform: 'none', borderRadius: '10px', px: 2.4 }}
                disabled
              >
                {translate('Cancel')}
              </Button>
            </Stack>
          </Form.Item>
        </Form>
      </Loading>
    </div>
  );
}
