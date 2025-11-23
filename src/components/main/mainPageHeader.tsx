import ThemeSelector from '../themeSelector.tsx'

const MainPageHeader = () => {
	return (
		<div className="flex justify-between border-b-1 border-content4 p-4">
			<div>
				<h1 className="text-2xl font-bold">EnvManager</h1>
				<p>Версия {import.meta.env.VITE_VERSION}</p>
			</div>
			<ThemeSelector />
		</div>
	)
}

export default MainPageHeader
