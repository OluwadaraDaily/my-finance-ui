import { ITransaction } from "@/types/transactions";

const companyNames = [
  "Netflix", "Spotify", "Amazon", "Uber", "Airbnb", "Starbucks", 
  "Apple", "Google", "Microsoft", "Meta", "Twitter", "LinkedIn",
  "Instagram", "TikTok", "YouTube"
]

const personNames = [
  "John Smith", "Emma Wilson", "Michael Brown", "Sarah Davis", "David Miller",
  "Lisa Anderson", "James Taylor", "Maria Garcia", "Robert Johnson", "Patricia White",
  "William Lee", "Elizabeth Clark", "Richard Hall", "Jennifer Lewis", "Charles Walker"
]

// Predefined dates to ensure consistency
const dates = [
  "15 Mar 2024", "22 Mar 2024", "29 Mar 2024", "05 Apr 2024", "12 Apr 2024",
  "19 Apr 2024", "26 Apr 2024", "03 May 2024", "10 May 2024", "17 May 2024",
  "24 May 2024", "31 May 2024", "07 Jun 2024", "14 Jun 2024", "21 Jun 2024"
]

// Predefined amounts to ensure consistency
const amounts = [
  1250.50, -850.75, 2300.25, -1500.00, 950.25,
  -1750.50, 2800.75, -1200.25, 1650.00, -950.50,
  2100.25, -1350.75, 1850.50, -1100.25, 2450.00
]

const categories = [
  "Entertainment", "Bills", "Groceries", "Dining Out", "Shopping", "Transportation", "Personal Care", "Education", "Lifestyle", "Shopping", "General"
]

export const transactions: ITransaction[] = Array.from({ length: 50 }, (_, index) => {
  const isCompany = index % 2 === 0
  const name = isCompany 
    ? companyNames[index % companyNames.length]
    : personNames[index % personNames.length]
  
  const imageNumber = (index % 15) + 1
  const imageUrl = isCompany 
    ? `/images/profiles/Logo ${imageNumber}.svg`
    : `/images/profiles/Person ${imageNumber}.png`

  return {
    name,
    imageUrl,
    amount: amounts[index % amounts.length],
    date: dates[index % dates.length],
    category: categories[index % categories.length]
  }
})