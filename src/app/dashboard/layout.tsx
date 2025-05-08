import DashboardSidebar from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col lg:flex-row-reverse w-full h-full">
      <div className="w-full bg-white">
        <div className="h-[calc(100vh-52px)] md:h-[calc(100vh-74px)] lg:min-h-screen lg:overflow-y-auto">
          {children}
        </div>
        <div>
          <DashboardSidebar/>
        </div>
      </div>
    </div>
  )
}