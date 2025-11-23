import {
	Button,
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
import { retrieveGroup, writeGroup } from '../../../api'
import { Controller, useForm } from 'react-hook-form'

interface IProps {
	groupId?: string
}

interface IForm {
	name: string
}

const WriteGroupModal: FC<IProps> = ({ groupId }) => {
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
		mutationFn: retrieveGroup,
		mutationKey: ['retrieveGroup', groupId],

		onSuccess: (data) => {
			form.reset({ name: data.name })
		},
	})

	const { mutate: write, isPending } = useMutation({
		mutationFn: writeGroup,
		mutationKey: ['writeGroup', groupId],

		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['projectGroups'] })
			close()
		},
	})

	useEffect(() => {
		if (groupId) {
			retrieve(groupId)
		}
	}, [groupId, retrieve])

	const handleSubmit = (data: IForm) => {
		write({
			id: groupId,
			name: data.name,
		})
	}

	return (
		<Modal
			isOpen
			onOpenChange={(v) => !v && close()}
		>
			<ModalContent>
				<ModalHeader>
					{groupId ? 'Редактирование группы' : 'Создание группы'}
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
									label="Название группы"
									aria-label="Название группы"
									value={value}
									onValueChange={onChange}
								/>
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

export default WriteGroupModal
