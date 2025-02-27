import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Gerenciamento de Chamados",
  description: "Gerenciamento de chamados e projetos de TI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'