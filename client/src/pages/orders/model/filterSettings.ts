import { OrderStatus } from "../../../entities";
import { PageParams, SortConfig } from "../../../widgets";

const defaultStatusLabel = "All";
const statusLabels = [defaultStatusLabel, ...Object.keys(OrderStatus)] as const;

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

export class OrdersPageParams extends PageParams {
  forItem: string;
  statusLables = statusLabels;
  status: number;

  constructor() {
    super();
    this.initSort(sortConfig);

    this.statusLabel = this.currentUrl.searchParams.get("statusLabel") as typeof this.statusLables[number] || this.statusLables[0],
    this.status = this.statusLables.indexOf(this.statusLabel) - 1;

    // this.forItem = this.currentUrl.searchParams.get("forItem") || "";
  }
}

// import { Order, OrderStatus } from "../../../entities";
// import { DEFAULT_PAGINATION_SIZE } from "../../../shared";
// import { SortConfig, SortOption } from "../../../widgets";

// /** rename to filterableFields */
// const defaultStatusLabel = "All";
// export const statusSelectConfig = [defaultStatusLabel, ...Object.keys(OrderStatus)] as const;

// export const sortConfig: SortConfig = {
//   "Сначала c меньшей суммой": {
//     by : "total",
//     direction : "asc",
//   },
//   "Сначала с большей суммой": {
//     by : "total",
//     direction : "desc",
//   },
// } as const;

// export const initialSettings = ((currentUrl) => {
//   const prepare: {
//     /**
//      * State specific
//      */
//     currentUrl: URL
//     /**
//      * Pagination specific
//      */
//     page: number,
//     paginationSize: number,
//     pagesCount: number,

//     /**
//      * Sorting specific
//      */
//     sortLabel: keyof typeof sortConfig,
//     sort: SortOption,

//     filteredItems: unknown[] | null
//     /** @todo give it a generic name to abstract the logic */
//     filteredOrders: Order[] | null,

//     /** @todo need to abstract logic,
//      * need an abstraction for discrete filtering
//      * client-side
//      * should I pass custom filtering callback here?
//      */
//     forItem: number | null,

//     statusLabel: typeof statusSelectConfig[number],
//     status: number,
//   } = {
//     currentUrl: currentUrl,
//     page: Number(currentUrl.searchParams.get("page")) || 1,
//     paginationSize: Number(currentUrl.searchParams.get("paginationSize")) || DEFAULT_PAGINATION_SIZE,
//     pagesCount: 1,
//     forItem: Number(currentUrl.searchParams.get("forItem")) || null,
//     sortLabel: currentUrl.searchParams.get("sortLabel") as keyof typeof sortConfig || Object.keys(sortConfig)[0],
//     sort: Object.values(sortConfig)[0],
//     sortConfig: sortConfig,
//     statusLabel: currentUrl.searchParams.get("statusLabel") as typeof statusSelectConfig[number] || statusSelectConfig[0],
//     status: 0,
//     filteredOrders: null,
//     /** Too specific, not good, but for now it’s ok */
//     statusSelectConfig: statusSelectConfig,
//   };
//   prepare.sort = sortConfig[prepare.sortLabel];
//   prepare.status = statusSelectConfig.indexOf(prepare.statusLabel) - 1;

//   return prepare;
// })(new URL(window.location.href));

// export { reducer } from "../../../widgets";
