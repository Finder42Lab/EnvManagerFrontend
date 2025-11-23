import { useState } from 'react'
import { Button, type Selection } from '@heroui/react'
import { Accordion, AccordionItem } from '@heroui/react'
import ProjectCards from './projectCards.tsx'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { FaPen, FaTrash } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import { getProjectGroups } from '../../../api'

const ProjectGroupsSelector = () => {
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())

	const { selectedProjectId } = useSearch({ from: '/' })
	const navigate = useNavigate()

	const { data: groups } = useQuery({
		queryFn: getProjectGroups,
		queryKey: ['projectGroups'],
		placeholderData: [],
	})

	if (!groups) {
		return <p></p>
	}

	const openModal = (modalType: string, groupID: string) => {
		navigate({
			to: '/',
			search: (old) => ({
				...old,
				modal_type: modalType,
				modal_id: groupID,
			}),
		})
	}

	if (selectedProjectId && groups.length > 0) {
		const expandedGroup = groups.find((item) =>
			item.projects.some((i) => i.id == selectedProjectId),
		)?.id

		if (
			expandedGroup &&
			selectedKeys != 'all' &&
			!selectedKeys.has(expandedGroup)
		) {
			setSelectedKeys((old) => new Set([...old, expandedGroup]))
		}
	}

	return (
		<div className="p-2">
			<Accordion
				isCompact
				aria-label="Группы"
				selectionMode="multiple"
				selectedKeys={selectedKeys}
				onSelectionChange={setSelectedKeys}
			>
				{groups.map((group) => (
					<AccordionItem
						key={group.id}
						title={<div>{group.name} </div>}
						aria-label={group.name}
					>
						<div className="flex gap-2 pb-2">
							<Button
								size="sm"
								variant="flat"
								color="warning"
								className="w-full"
								onPress={() =>
									openModal('writeGroup', group.id)
								}
							>
								<FaPen />
							</Button>
							<Button
								size="sm"
								variant="flat"
								color="danger"
								className="w-full"
								onPress={() =>
									openModal('deleteGroup', group.id)
								}
							>
								<FaTrash />
							</Button>
						</div>
						<ProjectCards projects={group.projects} />
					</AccordionItem>
				))}
			</Accordion>
		</div>
	)
}

export default ProjectGroupsSelector
