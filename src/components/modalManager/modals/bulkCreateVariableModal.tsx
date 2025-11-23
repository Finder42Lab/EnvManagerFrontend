import {
	Button,
	Code,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
} from '@heroui/react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { type FC } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bulkCreateVariables } from '../../../api'
import { Controller, useForm } from 'react-hook-form'

interface IProps {
	projectId: string
}

interface IForm {
	variables: string
}

const BulkCrealeVariablesModal: FC<IProps> = ({ projectId }) => {
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

	const { mutate: write, isPending } = useMutation({
		mutationFn: bulkCreateVariables,
		mutationKey: ['writeVariables', projectId],

		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['projectVariables', projectId] })
			close()
		},
	})

	const handleSubmit = (data: IForm) => {
		write({
			project_id: projectId,
			variables_text: data.variables,
		})
	}

	return (
		<Modal
			isOpen
			onOpenChange={(v) => !v && close()}
		>
			<ModalContent>
				<ModalHeader>Множественное создание переменных</ModalHeader>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<ModalBody>
						<p>
							Обрабатываются строки, которые соответствуют
							формату:
						</p>

						<Code>VAR_NAME=VALUE</Code>

						<Controller
							control={form.control}
							name="variables"
							render={({
								field: { value, onChange, ...field },
							}) => (
								<Textarea
									{...field}
									required
									label="Переменные"
									aria-label="Переменные"
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

export default BulkCrealeVariablesModal
