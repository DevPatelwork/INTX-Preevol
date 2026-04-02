import dayjs from 'dayjs';
import { useMoney, useDate } from '@/settings';
import useLanguage from '@/locale/useLanguage';
import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';

export default function TransactionDocumentList({ entity, label }) {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { moneyFormatter } = useMoney();

  const searchConfig = { entity: 'client', displayLabels: ['name'], searchFields: 'name' };
  const deleteModalLabels = ['number'];
  const dataTableColumns = [
    { title: translate('Number'), dataIndex: 'number' },
    { title: translate('Client'), dataIndex: ['client', 'name'] },
    {
      title: translate('Date'),
      dataIndex: 'date',
      render: (date) => dayjs(date).format(dateFormat),
    },
    {
      title: translate('Expire Date'),
      dataIndex: 'expiredDate',
      render: (date) => dayjs(date).format(dateFormat),
    },
    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: () => ({ style: { textAlign: 'right', whiteSpace: 'nowrap', direction: 'ltr' } }),
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    { title: translate('Status'), dataIndex: 'status' },
  ];

  const config = {
    entity,
    PANEL_TITLE: label,
    DATATABLE_TITLE: `${label} List`,
    ADD_NEW_ENTITY: `Add New ${label}`,
    ENTITY_NAME: label,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  return (
    <ErpLayout>
      <ErpPanel config={config} />
    </ErpLayout>
  );
}
