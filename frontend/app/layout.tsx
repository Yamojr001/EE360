import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'EE360 | School & Farm Management',
  description: 'Comprehensive school and farm management system with student tracking, academic records, financial management, and farm operations for Nigerian institutions.',
  keywords: ['school management', 'farm management', 'student information system', 'Nigeria'],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className={`${geist.className} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
