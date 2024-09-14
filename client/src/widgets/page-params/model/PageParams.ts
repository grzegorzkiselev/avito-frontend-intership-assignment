import { DEFAULT_PAGINATION_SIZE } from "../../../shared";

export const sortDirectionLabels = ["asc", "desc"] as const;

export type SortOption = {
  by: string,
  direction: typeof sortDirectionLabels[number],
};

export const actions = {
  setProperty(settings, action) {
    settings[action.type] = action.value;
  },
  updateSearchParams(settings, action) {
    settings.currentUrl.searchParams.set(action.type, "" + settings[action.type]);
  },
  applySearchParams(settings) {
    try {
      window?.history?.replaceState(null, "", settings.currentUrl);
    } catch(error) {
      console.error(error);
    }
  },
  pagesCount(settings, action) {
    this.setProperty(settings, action);
  },
  initialPagesCount(settings, action) {
    this.setProperty(settings, action);
  },
  page(settings, action) {
    this.setProperty(settings, action);
    this.updateSearchParams(settings, action);
  },
  paginationSize(settings, action) {
    this.setProperty(settings, action);
    this.updateSearchParams(settings, action);
  },
  query(settings, action) {
    settings[action.type] = action.value.query;
    settings.currentUrl.searchParams.set(action.type, action.value.query);

    if (action.value.query.length < 1) {
      settings.filteredItems.items.length = 0;
      settings.pagesCount = settings.initialPagesCount;
      return;
    }

    const filteredItems = action.value.filterFunction();
    settings.filteredItems.items = filteredItems;
    settings.pagesCount = Math.ceil(filteredItems.length / settings.paginationSize) || 1;

    if (settings.page > settings.pagesCount) {
      this.page(settings, action);
    }

    if (
      typeof action.value.query !== "string"
      || action.value.query.length < 2
    ) {
      settings.pagesCount = settings.initialPagesCount;
      return;
    }

    !settings.searchHistory.includes(action.value.query) && settings.searchHistory.unshift(action.value.query);
    settings.searchHistory.length = Math.min(5, settings.searchHistory.length);
    localStorage.setItem("searchHistory", JSON.stringify(settings.searchHistory));
  },
  statusLabel(settings, action) {
    this.setProperty(settings, action);
    const selectedOptionIndex = Array.from(action.value.target.children).findIndex((element) => element.selected);
    settings[action.type] = settings.statusSelectConfig[selectedOptionIndex];
    settings.status = selectedOptionIndex  - 1;
    settings.currentUrl.searchParams.set(action.type, settings[action.type]);
    settings.sort = settings.sortConfig[settings.sortLabel];
    settings.page = 1;
  },
  sortLabel(settings, action) {
    this.setProperty(settings, action);
    settings.sortLabel = (Array.from(action.value.target.children).find((element) => element.selected)).value;
    settings.currentUrl.searchParams.set("sortLabel", settings.sortLabel);
    settings.sort = settings.sortConfig[settings.sortLabel];
    settings.page = 1;
  },
  range(settings, action) {
    this.setProperty(settings, action);
    const rangeLink = settings[action.type] as Range;
    settings.currentUrl.searchParams.set("max-" + action.type, "" + rangeLink.max);
  },
};

export type SortConfig = Record<string, SortOption>;

export abstract class PageParams {
  currentUrl = new URL(window.location.href);
  page: number = Number(this.currentUrl.searchParams.get("page")) || 1;
  paginationSize: number = Number(this.currentUrl.searchParams.get("paginationSize")) || DEFAULT_PAGINATION_SIZE;

  pagesCount: number = 1;
  ranges: Range[];
  sortLabel: string;
  sortOptions: SortOption[];
  clientsideFilteredItems: [];

  reduce: (action: { type: string, value: unknown }) => void;

  constructor({
    ranges, sortLabel, sortOptions, clientsideFilteredItems,
  }) {
    this.ranges = ranges;
    this.sortLabel = sortLabel;
    this.sortOptions = sortOptions;
    this.clientsideFilteredItems = clientsideFilteredItems;
  }
}

export const reducer = <S extends typeof initialSettings, T extends keyof typeof initialSettings>(settings: S, action: { type: T, value: S[T] }) => {
  const handler = actions[
    (action.type.endsWith("Range")
      ? "range"
      : action.type
    )];

  handler
    ? handler.call(actions, settings, action)
    : console.error("No handler for action:", action.type);

  try {
    actions.applySearchParams(settings);
  } catch(error) {
    console.error(error);
  }

  return { ...settings };
};
