import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

export default function TypeMaster() {
  const entity = 'type';
  const searchConfig = { displayLabels: ['typeName'], searchFields: 'typeName' };
  const deleteModalLabels = ['typeName'];

  const config = {
    entity,
    PANEL_TITLE: 'Type',
    DATATABLE_TITLE: 'Type List',
    ADD_NEW_ENTITY: 'Add New Type',
    ENTITY_NAME: 'Type',
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
