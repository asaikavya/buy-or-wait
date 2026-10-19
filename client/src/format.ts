const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}
export function formatCurrency(amount:number):string{
    return currency.format(amount);
}
// Today's date as "YYYY-MM-DD" in LOCAL time (toISOString() would use UTC)
export function todayIso(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");   // getMonth() is 0-based: Jan = 0
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

