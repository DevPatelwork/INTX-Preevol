import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

export default function Bank() {
  const entity = 'bank';
  const searchConfig = { displayLabels: ['bankName'], searchFields: 'bankName,branchName,ifscCode' };
  const deleteModalLabels = ['bankName', 'accountNo'];

  const config = {
    entity,
    PANEL_TITLE: 'Bank',
    DATATABLE_TITLE: 'Bank List',
    ADD_NEW_ENTITY: 'Add New Bank',
    ENTITY_NAME: 'Bank',
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
