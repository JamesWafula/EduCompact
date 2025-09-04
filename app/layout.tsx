import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EduCompact",
  description: "Comprehensive student and staff record management system",
    creator: 'https://github.com/JamesWafula/'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Function to get current year
  function copyright() {
    return `© ${new Date().getFullYear()} EdcuCompact School Record Management System. All rights reserved.`;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <main style={{ flex: 1 }}>{children}</main>
            <footer style={{ textAlign: "center", color: "#888", padding: "1rem 0" }}>
              {copyright()}
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
