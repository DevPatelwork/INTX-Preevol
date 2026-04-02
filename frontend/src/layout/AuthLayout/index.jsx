import React from 'react';
import { Layout, Row, Col } from 'antd';

export default function AuthLayout({ sideContent, children }) {
  return (
    <Layout className="authLayout">
      <Row className="authLayoutRow">
        <Col
          className="authLayoutAside"
          xs={{ span: 0, order: 2 }}
          sm={{ span: 0, order: 2 }}
          md={{ span: 11, order: 1 }}
          lg={{ span: 12, order: 1 }}
        >
          {sideContent}
        </Col>
        <Col
          className="authLayoutForm"
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 13, order: 2 }}
          lg={{ span: 12, order: 2 }}
        >
          {children}
        </Col>
      </Row>
    </Layout>
  );
}
