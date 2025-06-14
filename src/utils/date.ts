/**
 * Converts a Date object to the backend API format: "YYYY-MM-DDThh:mm:ssZ"
 * @param date - Date object to format
 * @returns ISO string in backend format
 */
export function formatDateForAPI(date: Date): string {
  return date.toISOString();
}

/**
 * Converts a date from backend API format to Date object
 * Ensures the date is interpreted in the local timezone
 * @param dateString - Date string in backend format
 * @returns Date object
 */
export function parseDateFromAPI(dateString: string): Date {
  const date = new Date(dateString);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + userTimezoneOffset);
}

/**
 * Formats a date for HTML date input (YYYY-MM-DD)
 * Ensures the date is formatted in the local timezone
 * @param date - Date object to format
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats form data dates for API submission
 * @param formData - Form data with Date objects
 * @returns Form data with formatted date strings
 */
export function formatFormDatesForAPI<T extends Record<string, unknown>>(
  formData: T,
  dateFields: (keyof T)[]
): T {
  const formatted = { ...formData };
  
  dateFields.forEach(field => {
    const value = formatted[field];
    if (value instanceof Date) {
      formatted[field] = formatDateForAPI(value) as T[keyof T];
    }
  });
  
  return formatted;
}

// Example of Zod schema with date transformation (alternative approach)
// import z from "zod";
// 
// export const dateTransform = z.date().transform((date) => date.toISOString());
// 
// // Usage in schema:
// const apiSchema = z.object({
//   name: z.string(),
//   start_date: dateTransform,
//   end_date: dateTransform,
// }); 