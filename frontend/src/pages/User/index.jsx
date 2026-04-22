import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields, dataTableColumns } from './config';

export default function User() {
  const entity = 'admin';
  const searchConfig = {
    displayLabels: ['name', 'email'],
    searchFields: 'name,email',
  };
  const deleteModalLabels = ['name', 'email'];

  const config = {
    entity,
    PANEL_TITLE: 'User Management',
    DATATABLE_TITLE: 'User List',
    ADD_NEW_ENTITY: 'Add New User',
    ENTITY_NAME: 'User',
    fields,
    dataTableColumns,
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
