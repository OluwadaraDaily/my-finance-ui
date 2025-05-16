export interface IPotItem {
  label: string,
  amount: number,
  color: string
}

export interface IPot {
  id: string,
  name: string,
  targetAmount: number,
  savedAmount: number,
  color: string
}