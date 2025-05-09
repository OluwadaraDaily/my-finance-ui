"use client"
import DashboardSidebar from "@/components/sidebar"
import { useState } from "react"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className={`flex-1 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'lg:ml-[88px]' : 'lg:ml-[300px]'
      }`}>
        <div className="h-[calc(100vh-52px)] md:h-[calc(100vh-74px)] lg:h-screen overflow-y-auto">
          {children}
        </div>
      </div>
      <DashboardSidebar onCollapse={setIsCollapsed} />
    </div>
  )
}