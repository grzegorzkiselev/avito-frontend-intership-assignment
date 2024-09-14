import { initialSettings } from "../../../pages/orders/model";
import { ADVERTISEMENTS_PROPS, DEFAULT_PAGINATION_SIZE, useGetMinMaxValues } from "../../../shared";

export const sortDirectionLabels = ["asc", "desc"] as const;
export type SortConfig = Record<string, SortOption>;
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
      this.page = settings.pagesCount;
    }

    if (
      typeof action.value.query !== "string"
      || action.value.query.length < 2
    ) {
      return;
    }

    !settings.searchHistory.includes(action.value.query) && settings.searchHistory.unshift(action.value.query);
    settings.searchHistory.length = Math.min(5, settings.searchHistory.length);
    localStorage.setItem("searchHistory", JSON.stringify(settings.searchHistory));
  },
  forItem(settings, action) {
    setTimeout(() => {
      const filteredItems = action.value.filterFunction();
      settings.filteredItems.items = filteredItems;
      settings.pagesCount = Math.ceil(filteredItems.length / settings.paginationSize) || 1;
      if (settings.page > settings.pagesCount) {
        this.page = settings.pagesCount;
      }
    });
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
    settings.currentSortOption = settings.sortConfig[settings.sortLabel];
    console.log( settings.currentSortOption);
    settings.page = 1;
  },
  range(settings, action) {
    settings.ranges[
      settings.ranges.findIndex((range) => range.id === action.type)
    ] = action.value;

    settings.currentUrl.searchParams.set("min-" + action.type, "" + action.value.min);
    settings.currentUrl.searchParams.set("max-" + action.type, "" + action.value.max);
  },
  reset(settings) {
    settings.page = 1;
    settings.pagesCount = settings.initialPagesCount;
    settings.paginationSize = DEFAULT_PAGINATION_SIZE;

    settings.currentUrl.searchParams.forEach((_, param) => {
      settings.currentUrl.searchParams.delete(param);
    });
  },
  resetRanges(settings) {
    settings.ranges.forEach((range) => {
      range.min = range.minAvailable;
      range.max = range.maxAvailable;
    });
  },
  resetSort(settings) {
    const [defaultSortLabel, defaultSortOption] = Object.entries(settings.sortConfig)[0];
    settings.sortLabel = defaultSortLabel;
    settings.currentSortOption = defaultSortOption;
  },
  resetQuery(settings) {
    settings.query = "";
    settings.filteredItems.items = [];
  },
  statusLabel(settings, action) {
    const selectedOptionIndex = Array.from(action.value.target.children).findIndex((element) => element.selected);
    settings[action.type] = settings.statusLables[selectedOptionIndex];
    settings.status = selectedOptionIndex  - 1;
    settings.currentUrl.searchParams.set(action.type, settings[action.type]);
    settings.page = 1;
    // settings.sort = sortConfig[settings.sortLabel];
  },
};

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

export class PageParams {
  /**
   * State specific
   */
  currentUrl: URL = new URL(window.location.href);

  /**
   * Pagination specific
   */
  page: number = Number(this.currentUrl.searchParams.get("page")) || 1;
  paginationSize: number = Number(this.currentUrl.searchParams.get("paginationSize")) || DEFAULT_PAGINATION_SIZE;
  pagesCount: number = 1;

  /**
   * Sorting specific
   */
  currentSortOption: SortOption;
  sortLabel: string = "";
  sortOptions: SortOption[] = [];

  /**
   * Filtering by range specific
   * for different pages it should be different
   * so we need to figure out how to make it
   * configurable
   * @todo combine into single array
   */
  ranges = [];

  /**
   * Client-side features
   *
   * @todo give it a generic name to abstract the logic
   *
   * Items to render.
   * Should I paginate it right here instead of
   * passing slice of this array in template?
   *
   * Client features based on some kind of filtering
   * callback that dispatches new pagesCount and
   * narrowed collection of already server-side
   * ranged and sorted items
   */
  filteredItems = {
    items: [],
    getSliceForCurrentPage: () => {
      const start = (this.page - 1) * this.paginationSize;
      return this.filteredItems.items.slice(
        start,
        start + this.paginationSize,
      );
    },
  };

  protected reducer = reducer;

  protected initSort = (sortConfig) => {
    this.sortConfig = sortConfig;
    const [defaultSortLabel, defaultSortOption] = Object.entries(this.sortConfig)[0];
    this.sortLabel = this.currentUrl.searchParams.get("sortLabel") || defaultSortLabel;
    this.currentSortOption = this.sortConfig[this.sortLabel] || defaultSortOption;
  };

  protected initRanges = (ranges) => ranges.forEach((range) => {
    const { maxValueItem, isMinMaxValuesLoading, minMaxValueError } = useGetMinMaxValues(ADVERTISEMENTS_PROPS.endpoint, range.field);
    range.isLoading = isMinMaxValuesLoading;
    range.error = minMaxValueError;

    range.min = Number(this.currentUrl.searchParams.get("min-" + range.id)) || 0;
    range.max = Number(this.currentUrl.searchParams.get("max-" + range.id)) || Infinity;

    if (!isMinMaxValuesLoading && !minMaxValueError) {
      range.maxAvailable = maxValueItem?.data?.[0]?.[range.field];
      if (range.max === Infinity) {
        range.max = range.maxAvailable;
      }
    }
    this.ranges = ranges;
  });

  constructor() {
  }
}
