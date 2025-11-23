import { useQuery } from '@tanstack/react-query'
import { retrieveProject } from '../../api'
import type { FC } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@heroui/react'
import { FaPen, FaTrash } from 'react-icons/fa'

interface IProps {
	projectId: string
}

const ParentLinks: FC<{ parents: string[] }> = ({ parents }) => {
	if (parents.length <= 0) {
		return <p>Нет родительских проектов</p>
	}

	return (
		<div className="flex gap-2">
			<p>Родители:</p>

			{parents.map((parent) => (
				<Link
					to="/"
					search={{ selectedProjectId: parent }}
					key={parent}
				>
					{parent}
				</Link>
			))}
		</div>
	)
}

const SelectedProjectInfo: FC<IProps> = ({ projectId }) => {
	const navigate = useNavigate()

	const openModal = (modalName: string) => {
		navigate({
			to: '/',
			search: (old) => ({
				...old,
				modal_type: modalName,
				modal_id: projectId,
			}),
		})
	}

	const { data: project } = useQuery({
		queryFn: () => retrieveProject(projectId),
		queryKey: ['project', projectId],
	})

	return (
		<div className="flex justify-between p-4 border-b-1 border-l-1 border-content4">
			<div>
				<p>
					<span className="font-bold text-xl">{project?.name}</span>
					{project?.description && (
						<span> - {project.description}</span>
					)}
				</p>
				<p className="text-content4-foreground">ID: {project?.id}</p>
				<ParentLinks parents={project?.includes || []} />
			</div>
			<div className="grid grid-cols-2 gap-2">
				<Button
					isIconOnly
					size="sm"
					color="warning"
					variant="flat"
					onPress={() => openModal('writeProject')}
				>
					<FaPen />
				</Button>
				<Button
					isIconOnly
					size="sm"
					color="danger"
					variant="flat"
					onPress={() => openModal('deleteProject')}
				>
					<FaTrash />
				</Button>
			</div>
		</div>
	)
}

export default SelectedProjectInfo
