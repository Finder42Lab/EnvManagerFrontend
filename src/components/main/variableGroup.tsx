import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@heroui/react'
import type { IProject, IVariable } from '../../types'
import type { FC } from 'react'
import { FaPen, FaTrash } from 'react-icons/fa'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteVariable } from '../../api'

interface IProps {
	variables: IVariable[]
}

const ParentLink: FC<{ project: IProject }> = ({ project }) => {
	const { selectedProjectId } = useSearch({ from: '/' })

	if (project.id == selectedProjectId) {
		return ''
	}

	return (
		<p>
			<span>Унаследовано от </span>
			<Link
				to="/"
				search={{ selectedProjectId: project.id }}
				className="underline"
			>
				{project.name}
			</Link>
		</p>
	)
}

const VariableGroup: FC<IProps> = ({ variables }) => {
	const qc = useQueryClient()
	const navigate = useNavigate()

	const { mutate, isPending } = useMutation({
		mutationFn: deleteVariable,
		mutationKey: ['deleteVariable'],
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['projectVariables'] })
		},
	})

	const openModal = (variableId: string) => {
		navigate({
			to: '/',
			search: (old) => ({
				...old,
				modal_type: 'writeVariable',
				modal_id: variableId,
			}),
		})
	}

	return (
		<div>
			<Table
				isCompact
				aria-label="Группа"
				topContent={<ParentLink project={variables[0].project} />}
			>
				<TableHeader>
					<TableColumn width="40%">Название</TableColumn>
					<TableColumn>Значение</TableColumn>
					<TableColumn width="2%">Действия</TableColumn>
				</TableHeader>
				<TableBody>
					{variables.map((item) => (
						<TableRow>
							<TableCell>{item.name}</TableCell>
							<TableCell>
								{item.is_secret ? '***' : item.value}
							</TableCell>
							<TableCell>
								<div className="flex gap-2">
									<Button
										isIconOnly
										color="warning"
										size="sm"
										variant="flat"
										onPress={() => openModal(item.id)}
									>
										<FaPen />
									</Button>
									<Button
										isIconOnly
										color="danger"
										size="sm"
										variant="flat"
										isLoading={isPending}
										onPress={() => mutate(item.id)}
									>
										<FaTrash />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

export default VariableGroup
