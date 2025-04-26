import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/sidebar-provider"
import { ReactQueryProvider } from "@/lib/react-query"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mutara Livestock Management",
  description: "Smart farming solution for livestock management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}

