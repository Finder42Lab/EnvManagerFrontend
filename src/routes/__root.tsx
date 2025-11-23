import { createRootRoute, Outlet } from '@tanstack/react-router'
import ModalManager from '../components/modalManager/modalManager.tsx'
import { ToastProvider } from '@heroui/react'

interface ISearch {
	modal_type?: string
	modal_id?: string
}

export const Route = createRootRoute({
	component: RootComponent,
	validateSearch: (search) =>
		({
			modal_type: search.modal_type,
			modal_id: search.modal_id,
		}) as ISearch,
})

function RootComponent() {
	return (
		<main className="flex justify-center items-center h-[100dvh] w-full p-4">
			<div className="container">
				<Outlet />
				<ModalManager />
				<ToastProvider />
			</div>
		</main>
	)
}
