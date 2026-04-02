import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

export default function Product() {
  const entity = 'product';
  const searchConfig = {
    displayLabels: ['name', 'hsnOrSac'],
    searchFields: 'name,description,hsnOrSac',
  };
  const deleteModalLabels = ['name'];

  const config = {
    entity,
    PANEL_TITLE: 'Product',
    DATATABLE_TITLE: 'Product List',
    ADD_NEW_ENTITY: 'Add New Product',
    ENTITY_NAME: 'Product',
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
