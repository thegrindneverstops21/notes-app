const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, DATE_OPTIONS);
}
