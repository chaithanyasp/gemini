import './globals.css'
import ThemeProvider from '../components/ThemeProvider'
import { Toaster } from 'react-hot-toast'

export const metadata = { title: 'Kuvaka Gemini Clone' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
