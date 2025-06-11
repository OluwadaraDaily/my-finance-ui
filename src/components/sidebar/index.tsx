"use client"
import React, { useState } from "react"
import { sidebarData } from "./data"
import Image from "next/image"
import { SidebarItem } from "@/types/sidebar"
import { useRouter, usePathname } from "next/navigation"
import { activeItemStyle, activeItemStyleLg, dashboardItemStyle, dashboardItemStyleLg } from "./style"
import { authService } from "@/lib/api/services/authService"
import { LogOut } from "lucide-react"

interface DashboardSidebarProps {
  onCollapse: (isCollapsed: boolean) => void
}

export default function DashboardSidebar({ onCollapse }: DashboardSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const [activeItemId, setActiveItemId] = useState<number>(() => {
    const matchingItem = sidebarData.find(item => item.url === pathname)
    return matchingItem?.id ?? sidebarData[0].id
  })

  React.useEffect(() => {
    const matchingItem = sidebarData.find(item => item.url === pathname)
    if (matchingItem) {
      setActiveItemId(matchingItem.id)
    }
  }, [pathname])

  const handleItemClick = (item: SidebarItem) => {
    setActiveItemId(item.id)
    router.push(item.url)
  }

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    onCollapse(newState)
  }

  return (
    <aside>
      {/* Tablet and Mobile Sidebar */}
      <div
        className="fixed bottom-0 left-0 right-0 lg:hidden bg-grey-900 rounded-tl-lg rounded-tr-lg flex justify-between items-center pt-2 px-4 h-13 md:h-[74px]"
      >
        {sidebarData.map((item) => (
          <button
            key={item.id}
            className={`${dashboardItemStyle}
              ${activeItemId === item.id ? `${activeItemStyle}` : "text-grey-300"}`
            }
            onClick={() => handleItemClick(item)}
          >
            <Image
              src={activeItemId === item.id ? item.activeIcon : item.icon}
              alt={`${item.title} icon`}
              width={24}
              height={24}
              className={`cursor-pointer inline`}
            />
            <p className="hidden md:block font-bold text-xs">{item.title}</p>
          </button>
        ))}
      </div>

      {/* Large Screen Sidebar */}
      <div 
        className={`hidden lg:block bg-grey-900 rounded-tr-2xl rounded-br-2xl text-grey-300 fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[88px]' : 'w-[300px]'
        }`}
      >
        <div className="flex flex-col justify-between h-[85%]">
          {/* Top Section */}
          <div className="flex flex-col gap-8">
            <div className={`px-8 py-10 transition-all duration-300 ${isCollapsed ? 'px-6' : ''}`}>
              <div className="relative w-[121px] h-[22px]">
                <Image
                  src="/icons/logo.svg"
                  alt="My Finance Logo"
                  width={121}
                  height={22}
                  className={`absolute transition-opacity duration-300 ${
                    isCollapsed ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <Image
                  src="/icons/logo-small.svg"
                  alt="My Finance Logo"
                  width={12}
                  height={22}
                  className={`absolute transition-opacity duration-300 ${
                    isCollapsed ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
            </div>
            <div className="flex flex-col justify-start gap-4">
              {sidebarData.map((item) => (
                <button
                  key={item.id}
                  className={`${dashboardItemStyleLg} ${isCollapsed ? 'justify-center px-0 py-4' : 'px-8'} ${
                    activeItemId === item.id ? activeItemStyleLg : "text-grey-300"
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <Image
                    src={activeItemId === item.id ? item.activeIcon : item.icon}
                    alt={item.title}
                    width={24}
                    height={24}
                  />
                  <span className={`font-medium transition-all duration-300 ${isCollapsed ? 'hidden' : ''}`}>
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {/* Bottom Section */}
          <div>
            <button 
              onClick={toggleSidebar}
              className="flex items-center gap-3 py-4 px-8 hover:cursor-pointer"
            >
              <Image
                src="/icons/minimize-menu.svg"
                alt="Minimize icon"
                width={24}
                height={24}
                className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
              />
              <span className={`transition-all duration-300 ${isCollapsed ? 'hidden' : ''}`}>
                Minimize Menu
              </span>
            </button>
            {/* Sign out button */}
            <button 
              onClick={() => authService.logout()}
              className="flex items-center gap-3 py-4 px-8 hover:cursor-pointer"
            >
              <LogOut className="w-6 h-6 rotate-180"/>
              <span className={`transition-all duration-300 ${isCollapsed ? 'hidden' : ''}`}>
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}