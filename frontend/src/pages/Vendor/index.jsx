import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Vendor() {
  const translate = useLanguage();
  const entity = 'vendor';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name,email,contactNo1,contactNo2,gstin,panNo,contactPerson,city,state',
  };
  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: 'Vendor',
    DATATABLE_TITLE: 'Vendor List',
    ADD_NEW_ENTITY: 'Add New Vendor',
    ENTITY_NAME: 'Vendor',
  };
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
  };
  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} />}
      config={config}
    />
  );
}
