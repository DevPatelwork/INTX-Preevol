import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

export default function SubCategory() {
  const entity = 'subcategory';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['name'];

  const config = {
    entity,
    PANEL_TITLE: 'SubCategory',
    DATATABLE_TITLE: 'SubCategory List',
    ADD_NEW_ENTITY: 'Add New SubCategory',
    ENTITY_NAME: 'SubCategory',
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
