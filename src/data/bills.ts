  import { IBillsData } from "@/types/bills"

  export const BILLS_SUMMARY = {
    "Paid Bills": {
      numberOfBills: 10,
      totalAmount: 320,
    },
    "Total Upcoming": {
      numberOfBills: 6,
      totalAmount: 1230,
    },
    "Due Soon": {
      numberOfBills: 2,
      totalAmount: 40,
    },
  }

  export const BILLS_DATA: IBillsData[] = [
    {
      name: "Netflix",
      amount: 15.99,
      date: "15 Apr 2024",
      imageUrl: "/images/profiles/Logo 1.svg",
      status: "Paid"
    },
    {
      name: "Spotify",
      amount: 9.99,
      date: "20 Apr 2024",
      imageUrl: "/images/profiles/Logo 2.svg",
      status: "Pending"
    },
    {
      name: "Amazon Prime",
      amount: 14.99,
      date: "25 Apr 2024",
      imageUrl: "/images/profiles/Logo 3.svg",
      status: "Unpaid"
    },
    {
      name: "Apple iCloud",
      amount: 2.99,
      date: "28 Apr 2024",
      imageUrl: "/images/profiles/Logo 4.svg",
      status: "Paid"
    },
    {
      name: "Microsoft 365",
      amount: 69.99,
      date: "01 May 2024",
      imageUrl: "/images/profiles/Logo 5.svg",
      status: "Paid"
    },
    {
      name: "Adobe Creative Cloud",
      amount: 52.99,
      date: "05 May 2024",
      imageUrl: "/images/profiles/Logo 6.svg",
      status: "Pending"
    },
    {
      name: "YouTube Premium",
      amount: 11.99,
      date: "10 May 2024",
      imageUrl: "/images/profiles/Logo 7.svg",
      status: "Paid"
    },
    {
      name: "Disney+",
      amount: 7.99,
      date: "15 May 2024",
      imageUrl: "/images/profiles/Logo 8.svg",
      status: "Paid"
    },
    {
      name: "HBO Max",
      amount: 14.99,
      date: "20 May 2024",
      imageUrl: "/images/profiles/Logo 9.svg",
      status: "Unpaid"
    },
    {
      name: "LinkedIn Premium",
      amount: 29.99,
      date: "25 May 2024",
      imageUrl: "/images/profiles/Logo 10.svg",
      status: "Paid"
    }
  ]