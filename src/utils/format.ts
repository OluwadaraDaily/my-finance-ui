export const formatCurrency = (amount: number, options?: {
  currency?: string
  locale?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}) => {
  const {
    currency = 'NGN',
    locale = 'en-NG',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options || {}

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(amount)
} 

export const getOrdinalSuffix = (num: number) => {
  if (num % 10 === 1 && num !== 11) return "st";
  if (num % 10 === 2 && num !== 12) return "nd"; 
  if (num % 10 === 3 && num !== 13) return "rd";
  return "th";
}