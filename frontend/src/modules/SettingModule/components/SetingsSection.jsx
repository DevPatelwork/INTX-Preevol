import { Col, Row } from 'antd';
import { Box, Divider, Typography } from '@mui/material';

export default function SetingsSection({ title, description, children }) {
  return (
    <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
      <Col span={24}>
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: '#12243f', fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#5f6f85', mt: 0.5 }}>
            {description}
          </Typography>
        </Box>
      </Col>

      <Col
        xl={{ span: 18, offset: 2 }}
        lg={{ span: 24 }}
        md={{ span: 24 }}
        sm={{ span: 24 }}
        xs={{ span: 24 }}
      >
        {children}
      </Col>
      <Col span={24}>
        <Divider sx={{ borderColor: 'rgba(24, 42, 71, 0.12)' }} />
      </Col>
    </Row>
  );
}
