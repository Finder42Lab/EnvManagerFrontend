import { useState } from 'react'
import { Button } from '@heroui/react'
import { FaMoon, FaSun } from 'react-icons/fa6'

const ThemeSelector = () => {
	const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

	const toggleTheme = () => {
		const oldTheme = localStorage.getItem('theme') || ''
		const newTheme = oldTheme == 'light' ? 'dark' : 'light'

		setTheme(newTheme)
		localStorage.setItem('theme', newTheme)

		document.documentElement.classList.add(newTheme)
		document.documentElement.classList.remove(oldTheme)
	}

	return (
		<Button
			isIconOnly
			onPress={toggleTheme}
			variant="light"
		>
			{theme === 'dark' ? <FaSun /> : <FaMoon />}
		</Button>
	)
}

export default ThemeSelector
