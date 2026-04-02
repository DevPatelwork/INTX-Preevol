import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

export default function Goods() {
  const entity = 'goods';
  const searchConfig = { displayLabels: ['goodsName'], searchFields: 'goodsName,description,hsn' };
  const deleteModalLabels = ['goodsName'];

  const config = {
    entity,
    PANEL_TITLE: 'Goods',
    DATATABLE_TITLE: 'Goods List',
    ADD_NEW_ENTITY: 'Add New Goods',
    ENTITY_NAME: 'Goods',
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
