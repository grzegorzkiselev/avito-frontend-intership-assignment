export const API_BASE_URL = import.meta.env.VITE_API_ORIGIN || "http://localhost:3000";
export const BASE_ROOT = "/";
export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_PAGINATION_OPTIONS = ["10", "25", "50", "100"];
export const ADVERTISEMENTS_PROPS = {
  title: "Объявления",
  slug: "advertisements",
  endpoint: (new URL("advertisements", API_BASE_URL)).href,
};
export const ORDERS_PROPS = {
  title: "Заказы",
  slug: "orders",
  endpoint: (new URL("orders", API_BASE_URL)).href,
};
export const BREAKPOINT = 750;
