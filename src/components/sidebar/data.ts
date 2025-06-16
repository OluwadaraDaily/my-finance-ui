import { SidebarItem } from "@/types/sidebar";

export const sidebarData: SidebarItem[] = [
  {
    id: "1",
    title: "Overview",
    url: "/dashboard",
    icon: "/icons/home.svg",
    activeIcon: "/icons/home-active.svg"
  },
  {
    id: "2",
    title: "Transactions",
    url: "/dashboard/transactions",
    icon: "/icons/transactions.svg",
    activeIcon: "/icons/transactions-active.svg"
  },
  {
    id: "3",
    title: "Budgets",
    url: "/dashboard/budgets",
    icon: "/icons/budgets.svg",
    activeIcon: "/icons/budgets-active.svg"
  },
  {
    id: "4",
    title: "Pots",
    url: "/dashboard/pots",
    icon: "/icons/pots.svg",
    activeIcon: "/icons/pots-active.svg"
  },
  {
    id: "5",
    title: "Bills",
    url: "/dashboard/bills",
    icon: "/icons/bills.svg",
    activeIcon: "/icons/bills-active.svg"
  }
];