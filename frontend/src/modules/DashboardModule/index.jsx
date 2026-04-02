import { useEffect, useMemo, useState } from 'react';
import { Button, Col, DatePicker, Progress, Row, Segmented, Tag } from 'antd';
import {
  ArrowRightOutlined,
  FileTextOutlined,
  PlusOutlined,
  ProfileOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { useMoney } from '@/settings';
import { request } from '@/request';
import useOnFetch from '@/hooks/useOnFetch';
import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import storePersist from '@/redux/storePersist';

import RecentTable from './components/RecentTable';

dayjs.extend(utc);

const { RangePicker } = DatePicker;
const IST_OFFSET_MINUTES = 330;
const toIST = (value) => dayjs(value).utcOffset(IST_OFFSET_MINUTES);

export default function DashboardModule() {
  const { moneyFormatter } = useMoney();
  const moneyFormatSettings = useSelector(selectMoneyFormat);
  const navigate = useNavigate();
  const [trendRange, setTrendRange] = useState('1M');
  const [trendCustomRange, setTrendCustomRange] = useState([
    toIST(dayjs()).subtract(29, 'day').startOf('day'),
    toIST(dayjs()).endOf('day'),
  ]);
  const [trendHoveredIndex, setTrendHoveredIndex] = useState(null);
  const [currentCompany, setCurrentCompany] = useState(() => {
    const saved = storePersist.get('companyContext');
    return saved?.currentCompany || null;
  });

  const getStatsData = async ({ entity, currency }) => {
    return await request.summary({
      entity,
      options: { currency },
    });
  };

  const {
    result: invoiceResult,
    isLoading: invoiceLoading,
    onFetch: fetchInvoicesStats,
  } = useOnFetch();
  const { result: workOrderResult, isLoading: workOrderLoading, onFetch: fetchWorkOrderList } =
    useOnFetch();
  const { onFetch: fetchPaymentsStats } = useOnFetch();
  const {
    result: invoiceListResult,
    isLoading: invoiceListLoading,
    onFetch: fetchInvoiceList,
  } = useOnFetch();
  const {
    result: paymentListResult,
    isLoading: paymentListLoading,
    onFetch: fetchPaymentList,
  } = useOnFetch();
  const { result: serverTimeResult, onFetch: fetchServerTime } = useOnFetch();

  const getListData = async ({ entity }) => {
    return await request.listAll({
      entity,
      options: { sort: 'asc' },
    });
  };

  useEffect(() => {
    const currency = moneyFormatSettings.default_currency_code || null;
    fetchInvoicesStats(getStatsData({ entity: 'invoice', currency }));
    fetchWorkOrderList(getListData({ entity: 'workorder' }));
    fetchPaymentsStats(getStatsData({ entity: 'payment', currency }));
    fetchInvoiceList(getListData({ entity: 'invoice' }));
    fetchPaymentList(getListData({ entity: 'payment' }));
    fetchServerTime(request.get({ entity: 'server/time' }));
  }, [moneyFormatSettings.default_currency_code, currentCompany]);

  const renderMoney = (amount) =>
    moneyFormatter({
      amount: amount || 0,
      currency_code: moneyFormatSettings?.default_currency_code,
    });

  const openWorkOrdersCount = Array.isArray(workOrderResult) ? workOrderResult.length : 0;

  // Calculate month-over-month growth
  const monthlyGrowth = useMemo(() => {
    const invoicesRaw = Array.isArray(invoiceListResult) ? invoiceListResult : [];
    const now = dayjs();
    const currentMonthStart = now.startOf('month');
    const currentMonthEnd = now.endOf('month');
    const lastMonthStart = now.subtract(1, 'month').startOf('month');
    const lastMonthEnd = now.subtract(1, 'month').endOf('month');

    let currentMonthTotal = 0;
    let lastMonthTotal = 0;

    invoicesRaw.forEach((invoice) => {
      if (!invoice?.date || !invoice?.total) return;
      const invoiceDate = dayjs(invoice.date);
      if (invoiceDate.isAfter(currentMonthStart) && invoiceDate.isBefore(currentMonthEnd)) {
        currentMonthTotal += Number(invoice.total);
      } else if (invoiceDate.isAfter(lastMonthStart) && invoiceDate.isBefore(lastMonthEnd)) {
        lastMonthTotal += Number(invoice.total);
      }
    });

    if (lastMonthTotal === 0) {
      return currentMonthTotal > 0 ? '+100%' : '0%';
    }

    const growth = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  }, [invoiceListResult]);

  const summaryCards = [
    {
      icon: <ProfileOutlined />,
      hint: monthlyGrowth,
      title: 'Total Client Invoice Value',
      value: renderMoney(invoiceResult?.total),
      loading: invoiceLoading,
      tone: 'blue',
    },
    {
      icon: <ShoppingCartOutlined />,
      hint: `${
        (invoiceResult?.performance?.find((x) => x?.status === 'unpaid')?.count || 0) +
        (invoiceResult?.performance?.find((x) => x?.status === 'partially')?.count || 0)
      } Overdue`,
      title: 'Pending Vendor Payments',
      value: renderMoney(invoiceResult?.total_undue),
      loading: invoiceLoading,
      tone: 'orange',
    },
    {
      icon: <SettingOutlined />,
      hint: `${openWorkOrdersCount} In-Progress`,
      title: 'Open Work Orders',
      value: openWorkOrdersCount,
      loading: workOrderLoading,
      tone: 'slate',
    },
  ];

  const trendChartData = useMemo(() => {
    const activeCurrency = moneyFormatSettings?.default_currency_code;
    const invoicesRaw = Array.isArray(invoiceListResult) ? invoiceListResult : [];
    const paymentsRaw = Array.isArray(paymentListResult) ? paymentListResult : [];

    const normalizedCurrency = activeCurrency ? String(activeCurrency).toUpperCase() : null;
    const invoicesByCurrency = normalizedCurrency
      ? invoicesRaw.filter(
          (invoice) => String(invoice?.currency || '').toUpperCase() === normalizedCurrency
        )
      : invoicesRaw;
    const paymentsByCurrency = normalizedCurrency
      ? paymentsRaw.filter(
          (payment) => String(payment?.currency || '').toUpperCase() === normalizedCurrency
        )
      : paymentsRaw;

    // If currency-specific records are empty, fall back to all records
    const invoices = invoicesByCurrency.length ? invoicesByCurrency : invoicesRaw;
    const payments = paymentsByCurrency.length ? paymentsByCurrency : paymentsRaw;

    const serverNow = serverTimeResult?.now ? dayjs(serverTimeResult.now) : dayjs();
    const nowIST = toIST(serverNow);
    const anchorDate = nowIST.endOf('day');

    let startDate = anchorDate.subtract(29, 'day').startOf('day');
    let endDate = anchorDate.endOf('day');
    let unit = 'day';

    if (trendRange === '1D') {
      const endHour = nowIST.startOf('hour');
      endDate = endHour;
      startDate = endHour.subtract(23, 'hour');
      unit = 'hour';
    } else if (trendRange === '1W') {
      startDate = anchorDate.subtract(6, 'day').startOf('day');
    } else if (trendRange === 'CUSTOM') {
      if (Array.isArray(trendCustomRange) && trendCustomRange[0] && trendCustomRange[1]) {
        startDate = toIST(trendCustomRange[0]).startOf('day');
        endDate = toIST(trendCustomRange[1]).endOf('day');
      }
    }
    if (startDate.isAfter(endDate)) {
      const temp = startDate;
      startDate = endDate.startOf('day');
      endDate = temp.endOf('day');
    }

    const totalDays = Math.max(1, endDate.diff(startDate, 'day') + 1);
    if (trendRange !== '1D') {
      unit = totalDays > 62 ? 'week' : 'day';
    }
    const buckets = [];
    const bucketMap = {};

    let cursor = unit === 'hour' ? startDate.startOf('hour') : startDate.startOf(unit);
    const finalEnd = endDate.endOf(unit);

    while (cursor.isBefore(finalEnd) || cursor.isSame(finalEnd)) {
      const key = cursor.format(unit === 'hour' ? 'YYYY-MM-DD-HH' : 'YYYY-MM-DD');
      const label =
        unit === 'hour'
          ? cursor.format('HH:mm')
          : unit === 'week'
            ? `Wk ${cursor.format('DD MMM')}`
            : cursor.format('DD MMM');

      bucketMap[key] = {
        key,
        label,
        fullLabel: cursor.format('DD MMM YYYY HH:mm'),
        xDate: cursor,
        billed: 0,
        collected: 0,
      };
      buckets.push(bucketMap[key]);
      cursor = cursor.add(1, unit);
    }

    invoices.forEach((invoice) => {
      if (!invoice?.date) return;
      const date = toIST(invoice.date);
      if (date.isBefore(startDate) || date.isAfter(endDate)) return;
      const key = date
        .startOf(unit)
        .format(unit === 'hour' ? 'YYYY-MM-DD-HH' : 'YYYY-MM-DD');
      if (!bucketMap[key]) return;
      bucketMap[key].billed += Number(invoice?.total || 0);
    });

    payments.forEach((payment) => {
      // Strict mode: group collected amount only by related invoice date.
      const sourceDate = payment?.invoice?.date;
      if (!sourceDate) return;
      const date = toIST(sourceDate);
      if (date.isBefore(startDate) || date.isAfter(endDate)) return;
      const key = date
        .startOf(unit)
        .format(unit === 'hour' ? 'YYYY-MM-DD-HH' : 'YYYY-MM-DD');
      if (!bucketMap[key]) return;
      bucketMap[key].collected += Number(payment?.amount || 0);
    });

    const rawSeries = buckets.map((item, index) => ({ ...item, index }));
    const yMaxRaw = Math.max(1, ...rawSeries.flatMap((item) => [item.billed, item.collected]));
    const baseScale = Math.pow(10, Math.floor(Math.log10(yMaxRaw)));
    const yMax = Math.ceil(yMaxRaw / baseScale) * baseScale;

    const width = 1000;
    const height = 320;
    const margin = { top: 20, right: 24, bottom: 44, left: 64 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const maxIndex = Math.max(1, rawSeries.length - 1);

    const points = rawSeries.map((item) => {
      const x = margin.left + (item.index / maxIndex) * innerWidth;
      const yBilled = margin.top + innerHeight - (item.billed / yMax) * innerHeight;
      const yCollected = margin.top + innerHeight - (item.collected / yMax) * innerHeight;
      return { ...item, x, yBilled, yCollected };
    });

    const toPath = (key) =>
      points
        .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(2)} ${pt[key].toFixed(2)}`)
        .join(' ');

    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((step, idx) => ({
      value: Math.round(yMax * step),
      y: margin.top + innerHeight - step * innerHeight,
      key: `ytick-${idx}`,
    }));

    const xTickCount = Math.min(6, points.length);
    const xTicks = [];
    for (let i = 0; i < xTickCount; i += 1) {
      const idx = Math.round((i / Math.max(1, xTickCount - 1)) * (points.length - 1));
      const point = points[idx];
      if (!point) continue;
      if (xTicks.find((tick) => tick.x === point.x)) continue;
      xTicks.push({ x: point.x, label: point.label });
    }

    return {
      width,
      height,
      margin,
      innerHeight,
      points,
      billedPath: toPath('yBilled'),
      collectedPath: toPath('yCollected'),
      yTicks,
      xTicks,
      startLabel: startDate.format('DD MMM YYYY'),
      endLabel: endDate.format('DD MMM YYYY'),
    };
  }, [
    invoiceListResult,
    moneyFormatSettings?.default_currency_code,
    paymentListResult,
    serverTimeResult?.now,
    trendCustomRange,
    trendRange,
  ]);

  const trendStartLabel = trendChartData?.startLabel;
  const trendEndLabel = trendChartData?.endLabel;
  const trendLoading = invoiceListLoading || paymentListLoading;
  const hoveredPoint = useMemo(() => {
    if (trendHoveredIndex === null) return null;
    return trendChartData?.points?.[trendHoveredIndex] || null;
  }, [trendChartData?.points, trendHoveredIndex]);

  const onTrendChartMove = (event) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const points = trendChartData?.points || [];
    if (!points.length) return;
    let nearestIndex = 0;
    let minDistance = Infinity;
    for (let i = 0; i < points.length; i += 1) {
      const px = (points[i].x / trendChartData.width) * rect.width;
      const distance = Math.abs(px - cursorX);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }
    setTrendHoveredIndex(nearestIndex);
  };
  const dataTableColumns = [
    {
      title: 'PO Reference',
      dataIndex: 'number',
    },
    {
      title: 'Client Name',
      dataIndex: ['client', 'name'],
    },
    {
      title: 'Release Date',
      dataIndex: 'date',
      render: (date) => (date ? dayjs(date).format('MMM D, YYYY') : '-'),
    },
    {
      title: 'Value',
      dataIndex: 'total',
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => <Tag className="statusBadge">{status}</Tag>,
    },
  ];

  return (
    <div className="dashboardV2">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={18}>
          <Row gutter={[16, 16]}>
            {summaryCards.map((card, idx) => (
              <Col xs={24} md={8} key={idx}>
                <div className="dashboardCard summaryCard">
                  <div className={`summaryIcon ${card.tone}`}>{card.icon}</div>
                  <p className={`summaryHint ${card.tone}`}>{card.hint}</p>
                  <p className="summaryTitle">{card.title}</p>
                  <h3>{card.loading ? '...' : card.value}</h3>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
        <Col xs={24} lg={6}>
          <div className="dashboardCard systemCard">
            <h4>System Status</h4>
            <div className="statusLine">
              <span>Last Backup</span>
              <strong>Today, 04:00 AM</strong>
            </div>
            <div className="statusLine">
              <span>Active License</span>
              <strong className="textBlue">PRO TIER</strong>
            </div>
            <div className="statusLine">
              <span>DB Connectivity</span>
              <strong>Optimal</strong>
            </div>
            <Progress percent={98} showInfo={false} strokeColor="#1d61d6" />
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mrgTop16">
        <Col xs={24} lg={18}>
          <div className="dashboardCard chartCard">
            <div className="chartHeader">
              <div>
                <h3>Invoicing Trends</h3>
                <p>
                  Revenue flow comparison ({trendStartLabel || '-'} - {trendEndLabel || '-'})
                </p>
              </div>
              <div className="trendControls">
                <Segmented
                  value={trendRange}
                  options={[
                    { label: '1D', value: '1D' },
                    { label: '1W', value: '1W' },
                    { label: '1M', value: '1M' },
                    { label: 'Custom', value: 'CUSTOM' },
                  ]}
                  onChange={(value) => {
                    setTrendRange(value);
                    setTrendHoveredIndex(null);
                  }}
                />
                {trendRange === 'CUSTOM' && (
                  <RangePicker
                    value={trendCustomRange}
                    onChange={(value) => {
                      if (!value || !value[0] || !value[1]) return;
                      setTrendCustomRange(value);
                      setTrendHoveredIndex(null);
                    }}
                    allowClear={false}
                    size="small"
                  />
                )}
              </div>
              <div className="chartLegend">
                <span><i className="legendDot billed"></i>Billed</span>
                <span><i className="legendDot collected"></i>Collected</span>
              </div>
            </div>
            <div className="trendLineWrap">
              {trendLoading && <div className="trendLoadingMask">Loading trend data...</div>}
              <svg
                viewBox={`0 0 ${trendChartData.width} ${trendChartData.height}`}
                className="trendLineChart"
                onMouseMove={onTrendChartMove}
                onMouseEnter={onTrendChartMove}
                onMouseLeave={() => setTrendHoveredIndex(null)}
              >
                {trendChartData.yTicks.map((tick) => (
                  <g key={tick.key}>
                    <line
                      x1={trendChartData.margin.left}
                      y1={tick.y}
                      x2={trendChartData.width - trendChartData.margin.right}
                      y2={tick.y}
                      className="trendGridLine"
                    />
                    <text
                      x={trendChartData.margin.left - 12}
                      y={tick.y + 4}
                      textAnchor="end"
                      className="trendAxisText"
                    >
                      {renderMoney(tick.value)}
                    </text>
                  </g>
                ))}

                {trendChartData.xTicks.map((tick) => (
                  <text
                    key={`${tick.x}-${tick.label}`}
                    x={tick.x}
                    y={trendChartData.height - 12}
                    textAnchor="middle"
                    className="trendAxisText"
                  >
                    {tick.label}
                  </text>
                ))}

                <path d={trendChartData.billedPath} className="trendLine billed" />
                <path d={trendChartData.collectedPath} className="trendLine collected" />

                {hoveredPoint && (
                  <g>
                    <line
                      x1={hoveredPoint.x}
                      y1={trendChartData.margin.top}
                      x2={hoveredPoint.x}
                      y2={trendChartData.height - trendChartData.margin.bottom}
                      className="trendPointerLine"
                    />
                    <circle cx={hoveredPoint.x} cy={hoveredPoint.yBilled} r="5" className="trendPoint billed" />
                    <circle
                      cx={hoveredPoint.x}
                      cy={hoveredPoint.yCollected}
                      r="5"
                      className="trendPoint collected"
                    />
                  </g>
                )}
              </svg>

              {hoveredPoint && (
                <div className="trendTooltip">
                  <div className="trendTooltipLabel">{hoveredPoint.fullLabel}</div>
                  <div className="trendTooltipValue">
                    <span className="dot billed" /> Billed: {renderMoney(hoveredPoint.billed)}
                  </div>
                  <div className="trendTooltipValue">
                    <span className="dot collected" /> Collected: {renderMoney(hoveredPoint.collected)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Col>
        <Col xs={24} lg={6}>
          <div className="dashboardCard promoteCard">
            <h4>Automated Reporting</h4>
            <p>
              Set up scheduled PO summaries and vendor payment alerts directly to your inbox.
            </p>
            <Button type="primary" block className="solidActionBtn">
              Try Now
            </Button>
          </div>
          <div className="dashboardCard quickActionsCard">
            <h5>Quick Actions</h5>
            <div className="quickActionsGrid">
              <Button icon={<PlusOutlined />} onClick={() => navigate('/invoice/create')}>
                New PO
              </Button>
              <Button icon={<FileTextOutlined />} onClick={() => navigate('/invoice')}>
                Invoice
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <div className="dashboardCard recentCard mrgTop16">
        <div className="recentHeader">
          <h3>Recent PO Movements</h3>
          <Button type="link" icon={<ArrowRightOutlined />} onClick={() => navigate('/invoice')}>
            View All History
          </Button>
        </div>
        <RecentTable entity={'invoice'} dataTableColumns={dataTableColumns} />
      </div>

      <div className="dashboardFoot">
        <span>(c) 2026 Preevol Technics Systems</span>
        <span>Version 4.2.0</span>
      </div>
    </div>
  );
}
