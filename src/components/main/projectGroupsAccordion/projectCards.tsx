import type { IProject } from '../../../types'
import type { FC } from 'react'
import ProjectCard from './projectCard.tsx'

interface IProps {
	projects: IProject[]
}

const ProjectCards: FC<IProps> = ({ projects }) => {
	return (
		<>
			{projects?.map((item) => (
				<ProjectCard
					project={item}
					key={item.id}
				/>
			))}
		</>
	)
}

export default ProjectCards
