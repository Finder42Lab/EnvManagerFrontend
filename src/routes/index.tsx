import { Card, CardBody } from '@heroui/react'
import { createFileRoute, useSearch } from '@tanstack/react-router'
import { MainControl } from '../components'
import MainEmptyProject from '../components/main/mainEmpty.tsx'
import MainSelectedProjectVariables from '../components/main/mainSelectedProjectVariables.tsx'
import MainPageHeader from '../components/main/mainPageHeader.tsx'
import ProjectGroupsSelector from '../components/main/projectGroupsAccordion/projectGroupsSelector.tsx'
import SelectedProjectInfo from '../components/main/selectedProjectInfo.tsx'

interface IParams {
	selectedProjectId?: string
}

export const Route = createFileRoute('/')({
	component: RouteComponent,
	validateSearch: (params) =>
		({
			selectedProjectId: params.selectedProjectId,
		}) as IParams,
})

function RouteComponent() {
	const { selectedProjectId } = useSearch({ from: '/' })

	return (
		<Card>
			<CardBody className="grid grid-cols-[250px_1fr] grid-rows-[fit-content(100px)_1fr_fit-content(100px)] grid-flow-col h-[85vh] min-h-[500px] p-0">
				<MainPageHeader />
				<ProjectGroupsSelector />
				<MainControl />

				{!selectedProjectId && <MainEmptyProject />}
				{selectedProjectId && (
					<>
						<SelectedProjectInfo projectId={selectedProjectId} />
						<MainSelectedProjectVariables
							projectId={selectedProjectId}
						/>
					</>
				)}
			</CardBody>
		</Card>
	)
}
