import type { FC } from 'react'
import ProjectVariables from './projectVariables.tsx'
import { Button } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { FaPlus } from 'react-icons/fa6'

interface IProps {
	projectId: string
}

const MainSelectedProjectVariables: FC<IProps> = ({ projectId }) => {
	const navigate = useNavigate()

	const openModal = () => {
		navigate({
			to: '/',
			search: (old) => ({
				...old,
				modal_type: 'writeVariable',
				modal_id: undefined,
			}),
		})
	}

	return (
		<>
			<div className="p-4 overflow-auto border-l-1 border-content4">
				<ProjectVariables projectId={projectId} />
			</div>
			<div className="p-4 border-l-1 border-content4">
				<Button
					className="w-full"
					color="primary"
					variant="flat"
					onPress={openModal}
				>
					<FaPlus />
					<span>Добавить переменную</span>
				</Button>
			</div>
		</>
	)
}

export default MainSelectedProjectVariables
