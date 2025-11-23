import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientContext } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { addToast } from '@heroui/react'

const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			onError: (err: Error) =>
				addToast({
					color: 'danger',
					title: 'Ошибка при запросе',
					description: err + '',
				}),
		},
		queries: {
			throwOnError: (err: Error) => {
				addToast({
					color: 'danger',
					title: 'Ошибка при запросе',
					description: err + '',
				})
				return false
			},
		},
	},
})

// Set up a Router instance
const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	scrollRestoration: true,
})

// Register things for typesafety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientContext value={queryClient}>
			<RouterProvider router={router} />
		</QueryClientContext>
	</StrictMode>,
)
