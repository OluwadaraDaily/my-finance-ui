"use client"
import React, { useState } from "react"
import { sidebarData } from "./data"
import { Image } from "@/components/ui/image"
import { SidebarItem } from "@/types/sidebar"
import { useRouter, usePathname } from "next/navigation"
import { activeItemStyle, activeItemStyleLg, dashboardItemStyle, dashboardItemStyleLg } from "./style"
import { authService } from "@/lib/api/services/authService"
import { LogOut } from "lucide-react"

interface DashboardSidebarProps {
  onCollapse: (isCollapsed: boolean) => void
}

export default function DashboardSidebar({ onCollapse }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize activeItemId based on current pathname
  const [activeItemId, setActiveItemId] = useState<string>(() => {
    const currentItem = sidebarData.find(item => pathname === item.url);
    return currentItem?.id || "1"; // Default to Overview if no match
  });

  const handleItemClick = (item: SidebarItem) => {
    setActiveItemId(item.id);
    router.push(item.url);
  };

  const handleLogout = () => {
    authService.logout();
  };

  // Update activeItemId when pathname changes
  React.useEffect(() => {
    const currentItem = sidebarData.find(item => pathname === item.url);
    if (currentItem) {
      setActiveItemId(currentItem.id);
    }
  }, [pathname]);

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
              ${activeItemId === item.id ? activeItemStyle : "text-grey-300"}`
            }
            onClick={() => handleItemClick(item)}
          >
            <Image
              src={activeItemId === item.id ? item.activeIcon : item.icon}
              alt={`${item.title} icon`}
              width={24}
              height={24}
              className="cursor-pointer inline"
              priority
              sizes="24px"
              key={activeItemId === item.id ? item.activeIcon : item.icon}
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
                  priority
                  sizes="121px"
                />
                <Image
                  src="/icons/logo-small.svg"
                  alt="My Finance Logo"
                  width={12}
                  height={22}
                  className={`absolute transition-opacity duration-300 ${
                    isCollapsed ? 'opacity-100' : 'opacity-0'
                  }`}
                  priority
                  sizes="12px"
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
                    priority
                    sizes="24px"
                    key={activeItemId === item.id ? item.activeIcon : item.icon}
                  />
                  <span className={`font-medium transition-all duration-300 ${isCollapsed ? 'hidden' : ''}`}>
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col gap-8">
            <button
              className={`flex items-center gap-4 text-grey-300 hover:text-white transition-colors hover:cursor-pointer ${
                isCollapsed ? 'justify-center' : 'px-8'
              }`}
              onClick={() => {
                setIsCollapsed(!isCollapsed);
                onCollapse(!isCollapsed);
              }}
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
            <button
              className={`flex items-center gap-4 text-grey-300 hover:text-white transition-colors hover:cursor-pointer ${
                isCollapsed ? 'justify-center' : 'px-8'
              }`}
              onClick={handleLogout}
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
  );
}