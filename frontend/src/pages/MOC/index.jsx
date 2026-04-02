import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

export default function MOC() {
  const entity = 'moc';
  const searchConfig = { displayLabels: ['mocName'], searchFields: 'mocName' };
  const deleteModalLabels = ['mocName'];

  const config = {
    entity,
    PANEL_TITLE: 'MOC',
    DATATABLE_TITLE: 'MOC List',
    ADD_NEW_ENTITY: 'Add New MOC',
    ENTITY_NAME: 'MOC',
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
