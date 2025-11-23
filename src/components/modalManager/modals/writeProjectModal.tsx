import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
} from '@heroui/react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { type FC, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	getGroups,
	getProjectFreeParents,
	retrieveProject,
	writeProject,
} from '../../../api'
import { Controller, useForm, type UseFormReturn } from 'react-hook-form'

interface IProps {
	projectId?: string
}

interface IForm {
	id: string
	name: string
	description?: string
	includes: string[]
	group_id: string
}

type TForm = UseFormReturn<IForm, any, IForm>

interface IPropsWithForm {
	form: TForm
}

const useRetrieveProject = (form: TForm) =>
	useMutation({
		mutationFn: retrieveProject,
		mutationKey: ['retrieveProject'],

		onSuccess: (data) => {
			form.reset({
				id: data.id,
				name: data.name,
				description: data.description,
				includes: data.includes,
				group_id: data.group?.id,
			})
		},
	})

const useWriteProject = (close: (p?: string) => void, projectId?: string) => {
	const qc = useQueryClient()

	return useMutation({
		mutationFn: writeProject,
		mutationKey: ['writeProject', projectId],

		onSuccess: (new_project_id) => {
			qc.invalidateQueries({ queryKey: ['projectGroups'] })
			qc.invalidateQueries({ queryKey: ['project', projectId] })
			close(new_project_id)
		},
	})
}

const ParentSelector: FC<IPropsWithForm & { projectId?: string }> = ({
	form,
	projectId,
}) => {
	const { data: parents, isLoading } = useQuery({
		queryFn: () => getProjectFreeParents(projectId),
		queryKey: ['projectParents', projectId],
	})

	if (isLoading) {
		return <p>Загрузка...</p>
	}

	return (
		<Controller
			control={form.control}
			name="includes"
			render={({ field: { value, onChange, ...field } }) => (
				<Select
					{...field}
					label="Родители"
					aria-label="Родители"
					selectionMode="multiple"
					description="От этих проектов наследуются переменные"
					selectedKeys={isLoading ? [] : value}
					items={parents || []}
					onSelectionChange={(v) => onChange(Array.from(v))}
				>
					{(item) => (
						<SelectItem key={item.id}>{item.name}</SelectItem>
					)}
				</Select>
			)}
		/>
	)
}

const GroupSelector: FC<IPropsWithForm> = ({ form }) => {
	const { data: parents } = useQuery({
		queryFn: getGroups,
		queryKey: ['groups'],
	})

	return (
		<Controller
			control={form.control}
			name="group_id"
			render={({ field: { value, onChange, ...field } }) => (
				<Select
					{...field}
					required
					label="Группа"
					aria-label="Группа"
					selectedKeys={value ? [value] : []}
					items={parents || []}
					onSelectionChange={(v) => onChange(v.currentKey)}
				>
					{(item) => (
						<SelectItem key={item.id}>{item.name}</SelectItem>
					)}
				</Select>
			)}
		/>
	)
}

const WriteProjectModal: FC<IProps> = ({ projectId }) => {
	const location = useLocation()
	const navigate = useNavigate()

	const close = (project_id?: string) => {
		navigate({
			to: location.pathname,
			search: (old) => ({
				...old,
				modal_type: undefined,
				modal_id: undefined,
				selectedProjectId: project_id ?? old.selectedProjectId,
			}),
		})
	}

	const form = useForm<IForm>()

	const { mutate: retrieve } = useRetrieveProject(form)
	const { mutate: write, isPending } = useWriteProject(close, projectId)

	useEffect(() => {
		if (projectId) {
			retrieve(projectId)
		}
	}, [projectId, retrieve])

	const handleSubmit = (data: IForm) => {
		write({
			id: data.id,
			name: data.name,
			description: data.description,
			includes: data.includes,
			group_id: data.group_id,
		})
	}

	return (
		<Modal
			isOpen
			onOpenChange={(v) => !v && close()}
		>
			<ModalContent>
				<ModalHeader>
					{projectId ? 'Редактирование проекта' : 'Создание проекта'}
				</ModalHeader>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<ModalBody>
						<Controller
							control={form.control}
							name="id"
							render={({
								field: { value, onChange, ...field },
							}) => (
								<Input
									{...field}
									required
									disabled={!!projectId}
									label="ID"
									description="ID латиницей. По этому ID осуществяется переключение переменных среды"
									aria-name="ID"
									value={value}
									onValueChange={onChange}
								/>
							)}
						/>
						<Controller
							control={form.control}
							name="name"
							render={({
								field: { value, onChange, ...field },
							}) => (
								<Input
									{...field}
									required
									label="Название проекта"
									aria-name="Название проекта"
									value={value}
									onValueChange={onChange}
								/>
							)}
						/>
						<Controller
							control={form.control}
							name="description"
							aria-name="description"
							render={({
								field: { value, onChange, ...field },
							}) => (
								<Input
									{...field}
									label="Описание"
									value={value}
									onValueChange={onChange}
								/>
							)}
						/>
						<ParentSelector
							form={form}
							projectId={projectId}
						/>

						<GroupSelector form={form} />
					</ModalBody>
					<ModalFooter>
						<Button
							color="primary"
							type="submit"
							isLoading={isPending}
						>
							Сохранить
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	)
}

export default WriteProjectModal
