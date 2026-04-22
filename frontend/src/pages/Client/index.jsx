import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields, dataTableColumns } from './config';

export default function Client() {
  const entity = 'client';
  const searchConfig = {
    displayLabels: ['name', 'company'],
    searchFields: 'name,company',
  };
  const deleteModalLabels = ['name', 'company'];

  const config = {
    entity,
    PANEL_TITLE: 'Client Management',
    DATATABLE_TITLE: 'Client List',
    ADD_NEW_ENTITY: 'Add New Client',
    ENTITY_NAME: 'Client',
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
