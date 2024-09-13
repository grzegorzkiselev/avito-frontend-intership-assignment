import { DEFAULT_PAGINATION_SIZE } from "../../../shared";

export const sortDirectionLabels = ["asc", "desc"] as const;

export type SortOption = {
  by: string,
  direction: typeof sortDirectionLabels[number],
};

export const actions = {
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
  page(settings, action) {
    this.updateSearchParams(settings, action);
  },
  paginationSize(settings, action) {
    this.updateSearchParams(settings, action);
  },
  query(settings, action) {
    if (
      typeof action.value !== "string"
      || action.value.length < 2
    ) {
      return;
    }

    !settings.searchHistory.includes(action.value) && settings.searchHistory.unshift(action.value);
    settings.searchHistory.length = Math.min(5, settings.searchHistory.length);
    localStorage.setItem("searchHistory", JSON.stringify(settings.searchHistory));
    this.updateSearchParams(settings, action);
  },
  statusLabel(settings, action) {
    const selectedOptionIndex = Array.from(action.value.target.children).findIndex((element) => element.selected);
    settings[action.type] = settings.statusSelectConfig[selectedOptionIndex];
    settings.status = selectedOptionIndex  - 1;
    settings.currentUrl.searchParams.set(action.type, settings[action.type]);
    settings.sort = settings.sortConfig[settings.sortLabel];
    settings.page = 1;
  },
  sortLabel(settings, action) {
    settings.sortLabel = (Array.from(action.value.target.children).find((element) => element.selected)).value;
    settings.currentUrl.searchParams.set("sortLabel", settings.sortLabel);
    settings.sort = settings.sortConfig[settings.sortLabel];
    settings.page = 1;
  },
  range(settings, action) {
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
  settings[action.type] = action.value;
  actions[
    action.type.endsWith("Range")
      ? "range"
      : action.type
  ]?.(settings, action);

  try {
    actions.applySearchParams(settings);
  } catch(error) {
    console.error(error);
  }

  return { ...settings };
};

// const prepare: {
//   query: string,
//   searchHistory: string[],
//   page: number,
//   paginationSize: number,
//   pagesCount: number,
//   /** @todo rewrite duplicates as template literal types */
//   // [key: `${typeof filterableFields[number]}Range`]: Range,
//   priceRange: Range,
//   viewsRange: Range,
//   likesRange: Range,
//   sortLabel: keyof typeof sortConfig,
//   sort: sortOption,
//   filteredAdvertisements: Advertisement[] | null
// } = {
//   query: currentUrl.searchParams.get("query") || "",
//   searchHistory: (() => {
//     try {
//       return JSON.parse(localStorage.getItem("searchHistory") || "") || [];
//     } catch(error) {
//       return [];
//     }
//   })(),
//
//   page: Number(currentUrl.searchParams.get("page")) || 1,
//   paginationSize: Number(currentUrl.searchParams.get("paginationSize")) || DEFAULT_PAGINATION_SIZE,
//   pagesCount: 1,
//   priceRange: {
//     title: "Диапазон цен",
//     isLoading: true,
//     error: null,
//     minAvailable: 0,
//     maxAvailable: Infinity,
//     min: Number(currentUrl.searchParams.get("min-priceRange")) || 0,
//     max: Number(currentUrl.searchParams.get("max-priceRange")) || Infinity,
//   },
//   viewsRange: {
//     title: "Диапазон просмотров",
//     isLoading: true,
//     error: null,
//     minAvailable: 0,
//     maxAvailable: Infinity,
//     min: Number(currentUrl.searchParams.get("min-viewsRange")) || 0,
//     max: Number(currentUrl.searchParams.get("max-viewsRange")) || Infinity,
//   },
//   likesRange: {
//     title: "Диапазон лайков",
//     isLoading: true,
//     error: null,
//     minAvailable: 0,
//     maxAvailable: Infinity,
//     min: Number(currentUrl.searchParams.get("min-likesRange")) || 0,
//     max: Number(currentUrl.searchParams.get("max-likesRange")) || Infinity,
//   },
//   sortLabel: currentUrl.searchParams.get("sortLabel") as keyof typeof sortConfig || Object.keys(sortConfig)[0],
//   sort: Object.values(sortConfig)[0],
//   filteredAdvertisements: null,
// };
// prepare.sort = sortConfig[prepare.sortLabel];

// return prepare;
