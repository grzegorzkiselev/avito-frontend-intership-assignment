import { Advertisement } from "../../../entities";
import { PageParams, SortConfig } from "../../../widgets";
import { createReducer, defaultActions } from "../../../widgets/page-params";

export const sortConfig: SortConfig = {
  "Сначала дешевле": {
    by : "price",
    direction : "asc",
  },
  "Сначала дороже": {
    by : "price",
    direction : "desc",
  },
  "Сначала меньше лайков": {
    by : "likes",
    direction : "asc",
  },
  "Сначала больше лайков": {
    by : "likes",
    direction : "desc",
  },
  "Сначала меньше просмотров": {
    by : "views",
    direction : "asc",
  },
  "Сначала больше просмотров": {
    by : "views",
    direction : "desc",
  },
} as const;

const ranges = [
  {
    id: "priceRange",
    field: "price",
    title: "Диапазон цен",
    isLoading: true,
    error: null,
    minAvailable: 0,
    maxAvailable: Infinity,
    min: 0,
    max: Infinity,
  },
  {
    id: "viewsRange",
    field: "views",
    title: "Диапазон просмотров",
    isLoading: true,
    error: null,
    minAvailable: 0,
    maxAvailable: Infinity,
    min: 0,
    max: Infinity,
  },
  {
    id: "likesRange",
    field: "likes",
    title: "Диапазон лайков",
    isLoading: true,
    error: null,
    minAvailable: 0,
    maxAvailable: Infinity,
    min: 0,
    max: Infinity,
  },
];

function queryAction(settings: AdvertisementsPageParams, action: {
  type: "query",
  value: {
    query: string,
    filterFunction: () => Advertisement[]
  }
}) {
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

  if (settings.pagesCount < settings.page) {
    settings.page = settings.pagesCount;
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
}

const actions = {
  ...defaultActions,
  query: queryAction,
};

export class AdvertisementsPageParams extends PageParams {
  query: string;
  searchHistory: string[];

  constructor() {
    super();
    this.initRanges(ranges);
    this.initSort(sortConfig);

    this.query = this.currentUrl.searchParams.get("query") || "",
    this.searchHistory = (() => {
      try {
        return JSON.parse(localStorage.getItem("searchHistory") || "") || [];
      } catch(error) {
        return [];
      }
    })();

    this.reducer = createReducer(actions);
  }
}
