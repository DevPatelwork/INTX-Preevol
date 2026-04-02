import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

export default function GoodsInventory() {
  const entity = 'goodsinventory';
  const searchConfig = { displayLabels: ['inventoryType', 'remarks'], searchFields: 'inventoryType,remarks' };
  const deleteModalLabels = ['inventoryType', 'remarks'];

  const config = {
    entity,
    PANEL_TITLE: 'Goods Inventory',
    DATATABLE_TITLE: 'Goods Inventory List',
    ADD_NEW_ENTITY: 'Add New Goods Inventory',
    ENTITY_NAME: 'GoodsInventory',
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
