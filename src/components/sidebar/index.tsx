"use client"
import React, { useState } from "react"
import { sidebarData } from "./data"
import Image from "next/image"
import { SidebarItem } from "@/types/sidebar"
import { useRouter, usePathname } from "next/navigation"
import { activeItemStyle, dashboardItemStyle } from "./style"

export default function DashboardSidebar() {
  const router = useRouter()
  const pathname = usePathname()

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
  return (
    <aside>
      <div
        className="w-full lg:hidden bg-grey-900 rounded-tl-lg rounded-tr-lg flex justify-between items-center pt-2 px-4 h-13 md:h-[74px]"
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
    </aside>
  )
}