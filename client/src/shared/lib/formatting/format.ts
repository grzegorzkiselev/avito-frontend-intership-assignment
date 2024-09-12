export const formatRubles = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
}).format;

export const formatDate = (date: string) => new Intl.DateTimeFormat("ru-RU").format(new Date(date));
