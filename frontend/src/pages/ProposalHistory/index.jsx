import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

export default function ProposalHistory() {
  const entity = 'proposalhistory';
  const searchConfig = { displayLabels: ['proposalNumber'], searchFields: 'proposalNumber,pumpType,pumpModel' };
  const deleteModalLabels = ['proposalNumber'];

  const config = {
    entity,
    PANEL_TITLE: 'Proposal History',
    DATATABLE_TITLE: 'Proposal List',
    ADD_NEW_ENTITY: 'Add New Proposal',
    ENTITY_NAME: 'ProposalHistory',
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
