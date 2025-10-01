'use client'
import { useEffect, useState } from 'react'

export default function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])
  return (
    <div>
      <div className="p-2 flex justify-end">
        <button className="btn" onClick={() => setDark(!dark)}>Toggle Dark</button>
      </div>
      {children}
    </div>
  )
}
