import { IBudget } from "@/types/budgets"

export const BUDGET_SUMMARY_DATA = [
  {
    label: "Entertainment",
    amount: 50,
    color: "#277C78"
  },
  {
    label: "Bills",
    amount: 750,
    color: "#82C9D7"
  },
  {
    label: "Dinning Out",
    amount: 75,
    color: "#F2CDAC"
  },
  {
    label: "Personal Care",
    amount: 100,
    color: "#626070"
  },
]

export const BUDGET_DATA: IBudget[] = [
  {
    id: "1",
    name: "Entertainment",
    color: "#277C78",
    amount: 50,
    spent: 25,
    transactions: []
  },
  {
    id: "2",
    name: "Bills",
    color: "#82C9D7",
    amount: 750,
    spent: 250,
    transactions: []
  },
  {
    id: "3",
    name: "Dinning Out",
    color: "#F2CDAC",
    amount: 75,
    spent: 67,
    transactions: []
  },
  {
    id: "4",
    name: "Personal Care",
    color: "#626070",
    amount: 100,
    spent: 65,
    transactions: []
  }
]