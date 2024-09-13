import { Order, OrderStatus } from "../../../entities";
import { DEFAULT_PAGINATION_SIZE } from "../../../shared";
import { SortConfig, SortOption } from "../../../widgets";

const defaultStatusLabel = "All";
/** rename to filterableFields */
export const statusSelectConfig = [defaultStatusLabel, ...Object.keys(OrderStatus)] as const;

export const sortConfig: SortConfig = {
  "Сначала c меньшей суммой": {
    by : "total",
    direction : "asc",
  },
  "Сначала с большей суммой": {
    by : "total",
    direction : "desc",
  },
} as const;

export const initialSettings = ((currentUrl) => {
  const prepare: {
    /**
     * Pagination specific
     */
    page: number,
    paginationSize: number,
    pagesCount: number,

    /**
     * Sorting specific
     */
    sortLabel: keyof typeof sortConfig,
    sort: SortOption,

    /** @todo give it a generic name to abstract the logic */
    filteredOrders: Order[] | null,

    /** @todo need to abstract logic,
     * need an abstraction for discrete filtering
     * client-side
     * should I pass custom filtering callback here?
     */
    forItem: number | null,

    statusLabel: typeof statusSelectConfig[number],
    status: number,
  } = {
    currentUrl: currentUrl,
    page: Number(currentUrl.searchParams.get("page")) || 1,
    paginationSize: Number(currentUrl.searchParams.get("paginationSize")) || DEFAULT_PAGINATION_SIZE,
    pagesCount: 1,
    forItem: Number(currentUrl.searchParams.get("forItem")) || null,
    sortLabel: currentUrl.searchParams.get("sortLabel") as keyof typeof sortConfig || Object.keys(sortConfig)[0],
    sort: Object.values(sortConfig)[0],
    sortConfig: sortConfig,
    statusLabel: currentUrl.searchParams.get("statusLabel") as typeof statusSelectConfig[number] || statusSelectConfig[0],
    status: 0,
    filteredOrders: null,
    /** Too specific, not good, but for now it’s ok */
    statusSelectConfig: statusSelectConfig,
  };
  prepare.sort = sortConfig[prepare.sortLabel];
  prepare.status = statusSelectConfig.indexOf(prepare.statusLabel) - 1;

  return prepare;
})(new URL(window.location.href));

export { reducer } from "../../../widgets";
