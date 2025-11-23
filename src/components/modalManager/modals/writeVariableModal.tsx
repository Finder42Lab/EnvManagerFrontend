import {
	Button,
	Checkbox,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { type FC, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { retrieveVariable, writeVariable } from '../../../api'
import { Controller, useForm } from 'react-hook-form'

interface IProps {
	variableId?: string
	projectId: string
}

interface IForm {
	name: string
	value: string
	isSecret?: boolean
	projectId?: string
}

const WriteVariableModal: FC<IProps> = ({ variableId, projectId }) => {
	const location = useLocation()
	const navigate = useNavigate()
	const qc = useQueryClient()

	const close = () => {
		navigate({
			to: location.pathname,
			search: (old) => ({
				...old,
				modal_type: undefined,
				modal_id: undefined,
			}),
		})
	}

	const form = useForm<IForm>()

	const { mutate: retrieve } = useMutation({
		mutationFn: retrieveVariable,
		mutationKey: ['retrieveVariable', variableId],

		onSuccess: (data) => {
			form.reset({
				name: data.name,
				value: data.value,
				isSecret: data.is_secret,
				projectId: data.project.id,
			})
		},
	})

	const { mutate: write, isPending } = useMutation({
		mutationFn: writeVariable,
		mutationKey: ['writeVariable', variableId],

		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['projectVariables', projectId] })
			if (variableId) {
				form.reset({ name: '', value: '' })
			} else {
				close()
			}
		},
	})

	useEffect(() => {
		if (variableId) {
			retrieve(variableId)
		}
	}, [variableId, retrieve])

	const handleSubmit = (data: IForm) => {
		write({
			id: variableId,
			name: data.name,
			value: data.value,
			is_secret: data.isSecret,
			project_id: variableId ? data.projectId : projectId,
		})
	}

	return (
		<Modal
			isOpen
			onOpenChange={(v) => !v && close()}
		>
			<ModalContent>
				<ModalHeader>
					{variableId
						? 'Редактирование переменной'
						: 'Создание переменной'}
				</ModalHeader>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<ModalBody>
						<Controller
							control={form.control}
							name="name"
							render={({
								field: { value, onChange, ...field },
							}) => (
								<Input
									{...field}
									required
									label="Название"
									aria-label="Название"
									value={value}
									onValueChange={onChange}
								/>
							)}
						/>
						<Controller
							control={form.control}
							name="value"
							render={({
								field: { value, onChange, ...field },
							}) => (
								<Input
									{...field}
									required
									label="Значение"
									aria-label="Значение"
									value={value}
									onValueChange={onChange}
								/>
							)}
						/>
						<Controller
							control={form.control}
							name="isSecret"
							render={({
								field: { value, onChange, ...field },
							}) => (
								<Checkbox
									{...field}
									required
									aria-label="Секретное значение"
									isSelected={value}
									onValueChange={onChange}
								>
									Скрывать значение
								</Checkbox>
							)}
						/>
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

export default WriteVariableModal
