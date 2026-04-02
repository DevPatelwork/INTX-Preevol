import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

export default function ModelMaster() {
  const entity = 'model';
  const searchConfig = { displayLabels: ['modelName'], searchFields: 'modelName' };
  const deleteModalLabels = ['modelName'];

  const config = {
    entity,
    PANEL_TITLE: 'Model',
    DATATABLE_TITLE: 'Model List',
    ADD_NEW_ENTITY: 'Add New Model',
    ENTITY_NAME: 'Model',
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
