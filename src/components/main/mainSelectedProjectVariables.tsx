import type { FC } from 'react'
import ProjectVariables from './projectVariables.tsx'
import { Button, Tooltip } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { FaFileCirclePlus, FaPlus } from 'react-icons/fa6'

interface IProps {
	projectId: string
}

const MainSelectedProjectVariables: FC<IProps> = ({ projectId }) => {
	const navigate = useNavigate()

	const openModal = (modalName: string) => {
		navigate({
			to: '/',
			search: (old) => ({
				...old,
				modal_type: modalName,
				modal_id: undefined,
			}),
		})
	}

	return (
		<>
			<div className="p-4 overflow-auto border-l-1 border-content4">
				<ProjectVariables projectId={projectId} />
			</div>
			<div className="flex gap-2 p-4 border-l-1 border-content4">
				<Button
					className="w-full"
					color="primary"
					onPress={() => openModal('writeVariable')}
				>
					<FaPlus />
					<span>Добавить переменную</span>
				</Button>

				<Tooltip content="Множественное создание">
					<Button
						color="secondary"
						isIconOnly
						onPress={() => openModal('bulkCreateVariables')}
					>
						<FaFileCirclePlus />
					</Button>
				</Tooltip>
			</div>
		</>
	)
}

export default MainSelectedProjectVariables
