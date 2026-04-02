import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

export default function POProduct() {
  const entity = 'poproduct';
  const searchConfig = { displayLabels: ['productName'], searchFields: 'productName,hsnNoOrSacNo,machineNo' };
  const deleteModalLabels = ['productName'];

  const config = {
    entity,
    PANEL_TITLE: 'PO Product',
    DATATABLE_TITLE: 'PO Product List',
    ADD_NEW_ENTITY: 'Add New PO Product',
    ENTITY_NAME: 'POProduct',
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
