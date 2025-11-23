import type { FC } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteGroup } from '../../../api'
import {
	addToast,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react'
import { RequestError } from '../../../api/sendRequest.ts'

export interface IProps {
	groupId?: string
}

const DeleteGroupModal: FC<IProps> = ({ groupId }) => {
	const location = useLocation()
	const navigate = useNavigate()
	const qc = useQueryClient()

	const close = (reset?: boolean) => {
		navigate({
			to: location.pathname,
			search: (old) => ({
				...old,
				modal_type: undefined,
				modal_id: undefined,
				selectedProjectId: reset ? undefined : old.selectedProjectId,
			}),
		})
	}

	const { mutate } = useMutation({
		mutationFn: deleteGroup,
		mutationKey: ['deleteGroup'],
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['projectGroups'] })
			close(true)
		},
		onError: (e) => {
			if (e instanceof RequestError) {
				addToast({
					color: 'danger',
					title: 'Ошибка удаления',
					description: (e.data?.error as string) ?? '',
				})
			} else {
				addToast({
					color: 'danger',
					title: 'Ошибка при запросе',
					description: e + '',
				})
			}
		},
	})

	if (!groupId) {
		return <></>
	}

	return (
		<Modal
			isOpen
			onOpenChange={close}
		>
			<ModalContent>
				<ModalHeader>Удаление проекта</ModalHeader>
				<ModalBody>
					<p>Вы дейтвительно хотите удалить группу?</p>
				</ModalBody>
				<ModalFooter>
					<Button
						color="danger"
						onPress={() => mutate(groupId)}
					>
						Удлаить
					</Button>
					<Button onPress={() => close()}>Отменить</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default DeleteGroupModal
