import CrudModule from '@/modules/CrudModule/CrudModule';
import PaymentModeForm from '@/forms/PaymentModeForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function PaymentMode() {
  const translate = useLanguage();
  const entity = 'paymentmode';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name,description',
  };
  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: translate('payment_mode'),
    DATATABLE_TITLE: translate('payment_mode_list'),
    ADD_NEW_ENTITY: translate('add_new_payment_mode'),
    ENTITY_NAME: translate('payment_mode'),
  };

  const config = {
    entity,
    ...Labels,
    fields,
    searchConfig,
    deleteModalLabels,
  };

  return <CrudModule createForm={<PaymentModeForm />} updateForm={<PaymentModeForm />} config={config} />;
}
