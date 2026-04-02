import CrudModule from '@/modules/CrudModule/CrudModule';
import TaxForm from '@/forms/TaxForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function Taxes() {
  const translate = useLanguage();
  const entity = 'taxes';
  const searchConfig = {
    displayLabels: ['taxName'],
    searchFields: 'taxName',
  };
  const deleteModalLabels = ['taxName'];

  const Labels = {
    PANEL_TITLE: translate('taxes'),
    DATATABLE_TITLE: translate('taxes_list'),
    ADD_NEW_ENTITY: translate('add_new_tax'),
    ENTITY_NAME: translate('taxes'),
  };

  const config = {
    entity,
    ...Labels,
    fields,
    searchConfig,
    deleteModalLabels,
  };

  return <CrudModule createForm={<TaxForm />} updateForm={<TaxForm />} config={config} />;
}
