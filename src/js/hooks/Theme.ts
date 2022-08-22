import * as React from 'react'

const storageKey = 'themed'

export type ThemeProp = {
  isThemed: boolean
  toggleTheme: () => void
  setTheme?: React.Dispatch<React.SetStateAction<boolean>>
}
export type Theme = () => ThemeProp
export default (): ThemeProp => {
  const themed = localStorage.getItem(storageKey) === 'true'
  const [isThemed, setTheme] = React.useState<boolean>(themed);

  React.useEffect(() => {
    localStorage.setItem('themed', isThemed ? 'true' : 'false');
  }, [isThemed])

  const toggleTheme = () => {
    setTheme(!isThemed)
  }

  React.useDebugValue(isThemed ? 'Themed' : 'Not Themed')
  return { isThemed, toggleTheme, setTheme }
}
