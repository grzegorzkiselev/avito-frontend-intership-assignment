import { OrderStatus } from "../../../entities";
import { createReducer, defaultActions, PageParams, SortConfig } from "../../../widgets";

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

function forItem(settings, action) {
  const filteredItems = action.value.filterFunction();
  settings.filteredItems.items = filteredItems;
  settings.pagesCount = Math.ceil(filteredItems.length / settings.paginationSize);
  action.value.doneSignal();
}

function statusLabel(settings, action) {
  const selectedOptionIndex = Array.from(action.value.target.children).findIndex((element) => element.selected);
  settings[action.type] = settings.statusLables[selectedOptionIndex];
  settings.status = selectedOptionIndex  - 1;
  settings.currentUrl.searchParams.set(action.type, settings[action.type]);
  settings.page = 1;
}

const actions = {
  ...defaultActions,
  forItem: forItem,
  statusLabel: statusLabel,
};

export class OrdersPageParams extends PageParams {
  forItem: string;
  statusLables = statusLabels;
  status: number;

  constructor() {
    super();
    this.initSort(sortConfig);

    this.statusLabel = this.currentUrl.searchParams.get("statusLabel") as typeof this.statusLables[number] || this.statusLables[0],
    this.status = this.statusLables.indexOf(this.statusLabel) - 1;

    this.forItem = this.currentUrl.searchParams.get("forItem") || "";

    this.reducer = createReducer(actions);
  }
}
