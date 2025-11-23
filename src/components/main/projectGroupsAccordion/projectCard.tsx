import { type FC } from 'react'
import type { IProject } from '../../../types'
import classNames from 'classnames'
import { useNavigate, useSearch } from '@tanstack/react-router'

interface IProps {
	project: IProject
}

const ProjectCard: FC<IProps> = ({ project }) => {
	const { selectedProjectId } = useSearch({ from: '/' })
	const navigate = useNavigate({ from: '/' })

	const handleClick = () => {
		navigate({ to: '/', search: { selectedProjectId: project.id } })
	}

	return (
		<div
			className="py-1"
			onClick={handleClick}
		>
			<div
				className={classNames(
					'p-2 rounded-lg cursor-pointer bg-content2',
					{
						'bg-primary-500 text-primary-foreground':
							selectedProjectId == project.id,
					},
				)}
			>
				<p>{project.name}</p>
			</div>
		</div>
	)
}

export default ProjectCard
