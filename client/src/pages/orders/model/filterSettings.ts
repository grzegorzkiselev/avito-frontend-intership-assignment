import { Order, OrderStatus } from "../../../entities";
import { DEFAULT_PAGINATION_SIZE } from "../../../shared";

const defaultStatusLabel = "All";
export const statusSelectConfig = [defaultStatusLabel, ...Object.keys(OrderStatus)] as const;

type SortOption = {
  by: string,
  direction: "asc" | "desc"
};

export const sortConfig: Record<string, SortOption> = {
  "Сначала c меньшей суммой": {
    by : "total",
    direction : "asc",
  },
  "Сначала с большей суммой": {
    by : "total",
    direction : "desc",
  },
};

const currentUrl = new URL(window.location.href);
export const initialSettings = (() => {
  const pre: {
    page: number,
    paginationSize: number,
    pagesCount: number,
    forItem: number | null,
    sortLabel: keyof typeof sortConfig,
    sort: SortOption,
    statusLabel: typeof statusSelectConfig[number],
    status: number,
    filteredOrders: Order[] | null,
  } = {
    page: Number(currentUrl.searchParams.get("page")) || 1,
    paginationSize: Number(currentUrl.searchParams.get("paginationSize")) || DEFAULT_PAGINATION_SIZE,
    pagesCount: 0,
    forItem: Number(currentUrl.searchParams.get("forItem")) || null,
    sortLabel: currentUrl.searchParams.get("sortLabel") as keyof typeof sortConfig || Object.keys(sortConfig)[0],
    sort: Object.values(sortConfig)[0],
    statusLabel: currentUrl.searchParams.get("statusLabel") as typeof statusSelectConfig[number] || statusSelectConfig[0],
    status: 0,
    filteredOrders: null,
  };
  pre.sort = sortConfig[pre.sortLabel];
  pre.status = statusSelectConfig.indexOf(pre.statusLabel) - 1;

  return pre;
})();

export const reducer = (settings, action) => {
  settings[action.type] = action.value;
  if (
    action.type === "sortLabel"
  ) {
    settings[action.type] = (Array.from(action.value.target.children).find((element) => element.selected)).value;
    currentUrl.searchParams.set(action.type, settings[action.type]);

    settings.sort = sortConfig[settings.sortLabel];

    settings.page = 1;
  }

  if (
    action.type === "statusLabel"
  ) {
    const selectedOptionIndex = Array.from(action.value.target.children).findIndex((element) => element.selected);
    settings[action.type] = statusSelectConfig[selectedOptionIndex];
    settings.status = selectedOptionIndex  - 1;
    currentUrl.searchParams.set(action.type, settings[action.type]);
    settings.sort = sortConfig[settings.sortLabel];
    settings.page = 1;
  }

  if (action.type === "page"
    || action.type === "paginationSize"
  ) {
    currentUrl.searchParams.set(action.type, "" + settings[action.type]);
  }

  window.history.pushState(null, "", currentUrl);

  return { ...settings };
};
