export function parseNumeric(value: any): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return value;
  
  // Handle string numbers with possible currency symbols and localized separators
  const cleanValue = String(value)
    .replace(/[R$\s]/g, "") // Remove R$ and spaces
    .replace(/\./g, "")      // Remove thousands separator (assuming dot)
    .replace(",", ".");      // Replace decimal separator (assuming comma)
    
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? null : parsed;
}

export function normalizeDate(value: any): string | null {
  if (!value) return null;
  
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value); // Fallback to original string if invalid date
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  } catch {
    return String(value);
  }
}

export function trimString(value: any): string | null {
  if (value === null || value === undefined) return null;
  return String(value).trim();
}
