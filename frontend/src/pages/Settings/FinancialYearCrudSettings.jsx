import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from '@/pages/FinancialSettings/config';

export default function FinancialYearCrudSettings() {
  const entity = 'financialsettings';
  const searchConfig = { displayLabels: ['financialYear'], searchFields: 'financialYear' };
  const deleteModalLabels = ['financialYear'];

  const config = {
    entity,
    PANEL_TITLE: 'Financial Year Management',
    DATATABLE_TITLE: 'Financial Year List',
    ADD_NEW_ENTITY: 'Add New Financial Year',
    ENTITY_NAME: 'FinancialSettings',
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
