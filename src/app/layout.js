import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Play Tetris',
  description: 'Made by Nano',
}

export default function RootLayout({ children }) {
  return (
<html suppressHydrationWarning>
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}