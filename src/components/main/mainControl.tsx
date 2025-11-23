import { Button, Tooltip } from '@heroui/react'
import { FaFolderPlus, FaPlus } from 'react-icons/fa6'
import { useNavigate } from '@tanstack/react-router'

const MainControl = () => {
	const navigate = useNavigate()

	const openModal = (modalName: string) => {
		navigate({
			to: '/',
			search: (old) => ({ ...old, modal_type: modalName }),
		})
	}

	return (
		<div className="flex gap-2 p-4">
			<Tooltip content="Добавить группу">
				<Button
					isIconOnly
					onPress={() => openModal('writeGroup')}
				>
					<FaFolderPlus />
				</Button>
			</Tooltip>
			<Tooltip content="Добавить проект">
				<Button
					isIconOnly
					onPress={() => openModal('writeProject')}
				>
					<FaPlus />
				</Button>
			</Tooltip>
		</div>
	)
}

export default MainControl
