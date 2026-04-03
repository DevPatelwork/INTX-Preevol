import { Col, Row } from 'antd';
import { Box, Divider, Typography } from '@mui/material';

export default function SetingsSection({ title, description, children }) {
  return (
    <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
      <Col span={24}>
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: 'var(--on-surface)',
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'var(--on-surface-muted)',
              mt: 0.5,
            }}
          >
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
        <Divider sx={{ borderColor: 'var(--outline)' }} />
      </Col>
    </Row>
  );
}
