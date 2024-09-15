import { Range } from "../..";
import { PageParams } from "./PageParams";

type Action<K extends keyof PageParams> = { type: K, value: PageParams[K] };

export const defaultActions = {
  setProperty(settings: PageParams, action: Action<keyof PageParams>) {
    settings[action.type] = action.value;
  },
  updateSearchParams(settings: PageParams, action: Action<keyof PageParams>) {
    settings.currentUrl.searchParams.set(action.type, "" + settings[action.type]);
  },
  applySearchParams(settings: PageParams) {
    try {
      window?.history?.replaceState(null, "", settings.currentUrl);
    } catch(error) {
      console.error(error);
    }
  },
  page(settings: PageParams, action: Action<"page">) {
    this.setProperty(settings, action);
    this.updateSearchParams(settings, action);
  },
  pagesCount(settings: PageParams, action: Action<"pagesCount">) {
    this.setProperty(settings, action);
    if (settings.page > settings.pagesCount) {
      settings.page = settings.pagesCount;
      this.updateSearchParams(settings, { type: "page", value: "" });
    }
  },
  initialPagesCount(settings: PageParams, action: Action<"initialPagesCount">) {
    this.setProperty(settings, action);
  },
  resetPage(settings: PageParams) {
    const action = { type: "page" as keyof PageParams, value: 1 };
    this.setProperty(settings, action);
    this.updateSearchParams(settings, action);
  },
  paginationSize(settings: PageParams, action: Action<"paginationSize">) {
    this.setProperty(settings, action);
    settings.pagesCount = Math.ceil(settings.filteredItems.items.length / action.value) || 1;
    this.updateSearchParams(settings, action);
    this.resetPage(settings);
  },
  sortLabel(settings: PageParams, action: { type: "sortLabel", value: Event }) {
    settings.page = 1;
    settings.sortLabel = ((Array.from((action.value.target as HTMLSelectElement).children || []).find((element) => (element as HTMLOptionElement).selected)) as HTMLOptionElement)?.value;
    // this.setProperty(settings, { type: "sortLabel", value: sortLabel });
    settings.currentUrl.searchParams.set("sortLabel", settings.sortLabel);
    settings.currentSortOption = settings.sortConfig[settings.sortLabel];
  },
  range(settings: PageParams, action: { type: `${string}Range`, value: Range }) {
    settings.ranges[
      settings.ranges.findIndex((range) => range.id === action.type)
    ] = action.value;

    settings.currentUrl.searchParams.set("min-" + action.type, "" + action.value.min);
    settings.currentUrl.searchParams.set("max-" + action.type, "" + action.value.max);
  },

  /* Draft
  reset(settings: PageParams) {
    settings.page = 1;
    settings.pagesCount = settings.initialPagesCount;
    settings.paginationSize = DEFAULT_PAGINATION_SIZE;

    settings.currentUrl.searchParams.forEach((_, param) => {
      settings.currentUrl.searchParams.delete(param);
    });
  },
  resetRanges(settings: PageParams) {
    settings.ranges.forEach((range) => {
      range.min = range.minAvailable;
      range.max = range.maxAvailable;
    });
  },
  resetSort(settings: PageParams) {
    const [defaultSortLabel, defaultSortOption] = Object.entries(settings.sortConfig)[0];
    settings.sortLabel = defaultSortLabel;
    settings.currentSortOption = defaultSortOption;
  },
  resetQuery(settings: PageParams) {
    settings.query = "";
    settings.filteredItems.items = [];
  },
  */
};
