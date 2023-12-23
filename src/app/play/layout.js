import '../globals.css'
import { Providers } from '../providers'

export const metadata = {
  title: 'Play Tetris',
  description: 'Made by Nano',
}

export default function playLayout({ children }) {
  return (
        <Providers>{children}</Providers>
  )
}