import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "./components/Header"
import '../styles/globals.css'


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vatika Compaign",
  description: "A responsive landing page with a pink theme",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Header /> */}
        {children}
      </body>
    </html>
  )
}



import './globals.css'