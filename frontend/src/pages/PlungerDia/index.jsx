import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

export default function PlungerDia() {
  const entity = 'plungerdia';
  const searchConfig = { displayLabels: ['plungerDiaName'], searchFields: 'plungerDiaName' };
  const deleteModalLabels = ['plungerDiaName'];

  const config = {
    entity,
    PANEL_TITLE: 'Plunger Dia',
    DATATABLE_TITLE: 'Plunger Dia List',
    ADD_NEW_ENTITY: 'Add New Plunger Dia',
    ENTITY_NAME: 'PlungerDia',
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
