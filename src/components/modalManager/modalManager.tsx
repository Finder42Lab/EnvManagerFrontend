import { useSearch } from '@tanstack/react-router'
import WriteGroupModal from './modals/writeGroupModal.tsx'
import WriteProjectModal from './modals/writeProjectModal.tsx'
import DeleteProjectModal from './modals/deleteProjectModal.tsx'
import DeleteGroupModal from './modals/deleteGroupModal.tsx'
import WriteVariableModal from './modals/writeVariableModal.tsx'
import BulkCreateVariableModal from './modals/bulkCreateVariableModal.tsx'

const ModalManager = () => {
	const { modal_id, modal_type, selectedProjectId } = useSearch({ from: '/' })

	switch (modal_type) {
		case 'writeGroup':
			return <WriteGroupModal groupId={modal_id} />
		case 'writeProject':
			return <WriteProjectModal projectId={modal_id} />
		case 'writeVariable':
			return (
				selectedProjectId && (
					<WriteVariableModal
						variableId={modal_id}
						projectId={selectedProjectId}
					/>
				)
			)
		case 'bulkCreateVariables':
			return (
				selectedProjectId && (
					<BulkCreateVariableModal projectId={selectedProjectId} />
				)
			)
		case 'deleteProject':
			return <DeleteProjectModal projectId={modal_id} />
		case 'deleteGroup':
			return <DeleteGroupModal groupId={modal_id} />
	}

	return <div></div>
}

export default ModalManager
