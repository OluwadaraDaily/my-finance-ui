export interface IBillsData {
  name: string;
  amount: number;
  date: string;
  imageUrl: string;
  status: "Paid" | "Unpaid" | "Pending";
}
