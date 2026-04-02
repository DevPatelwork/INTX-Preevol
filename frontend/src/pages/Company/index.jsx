import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

export default function Company() {
  const entity = 'company';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['name'];

  const config = {
    entity,
    PANEL_TITLE: 'Company',
    DATATABLE_TITLE: 'Company List',
    ADD_NEW_ENTITY: 'Add New Company',
    ENTITY_NAME: 'Company',
    fields,
    searchConfig,
    deleteModalLabels,
  };

  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} isUpdateForm={true} />}
      config={config}
    />
  );
}
