import './globals.css'

export const metadata = {
  title: 'Our Voice, Our Rights - MGNREGA Dashboard',
  description: 'Track MGNREGA performance in your district',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
