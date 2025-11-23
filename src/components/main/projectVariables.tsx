import { useQuery } from '@tanstack/react-query'
import { getVariables } from '../../api'
import type { FC } from 'react'
import type { IVariable } from '../../types'
import VariableGroup from './variableGroup.tsx'

interface IProps {
	projectId: string
}

function groupVariables(variables: IVariable[]) {
	const groups: Record<string, IVariable[]> = {}
	for (const variable of variables) {
		if (variable.project.id in groups) {
			groups[variable.project.id].push(variable)
		} else {
			groups[variable.project.id] = [variable]
		}
	}

	return groups
}

const ProjectVariables: FC<IProps> = ({ projectId }) => {
	const { data: variables } = useQuery({
		queryFn: () => getVariables(projectId),
		queryKey: ['projectVariables', projectId],
	})

	const groups = groupVariables(variables || [])

	return (
		<div className="flex flex-col gap-4">
			{Object.entries(groups).map(([prId, group]) => (
				<VariableGroup
					variables={group}
					key={prId}
				/>
			))}
		</div>
	)
}

export default ProjectVariables
