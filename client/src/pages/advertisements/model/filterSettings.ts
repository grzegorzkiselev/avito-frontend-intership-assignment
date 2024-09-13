import { Advertisement } from "../../../entities";
import { DEFAULT_PAGINATION_SIZE } from "../../../shared";
import { Range } from "../../../widgets";

export type SortDirection = "asc" | "desc";

export const filterableFields = ["price", "views", "likes"] as const;

type sortOption = {
  by: filterableFields[number],
  direction: SortDirection
};

export type SortAction = {
  [key: string]: sortOption
};

export const sortConfig: SortAction = {
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


const currentUrl = new URL(window.location.href);

export const initialSettings = (() => {
  const prepare: {
    query: string,
    searchHistory: string[],
    page: number,
    paginationSize: number,
    pagesCount: number,
    /** @todo rewrite duplicates as template literal types */
    // [key: `${typeof filterableFields[number]}Range`]: Range,
    priceRange: Range,
    viewsRange: Range,
    likesRange: Range,
    sortLabel: keyof typeof sortConfig,
    sort: sortOption,
    filteredAdvertisements: Advertisement[] | null
  } = {
    query: currentUrl.searchParams.get("query") || "",
    searchHistory: (() => {
      try {
        return JSON.parse(localStorage.getItem("searchHistory") || "") || [];
      } catch(error) {
        return [];
      }
    })(),
    page: Number(currentUrl.searchParams.get("page")) || 1,
    paginationSize: Number(currentUrl.searchParams.get("paginationSize")) || DEFAULT_PAGINATION_SIZE,
    pagesCount: 1,
    priceRange: {
      title: "Диапазон цен",
      isLoading: true,
      error: null,
      minAvailable: 0,
      maxAvailable: Infinity,
      min: Number(currentUrl.searchParams.get("min-priceRange")) || 0,
      max: Number(currentUrl.searchParams.get("max-priceRange")) || Infinity,
    },
    viewsRange: {
      title: "Диапазон просмотров",
      isLoading: true,
      error: null,
      minAvailable: 0,
      maxAvailable: Infinity,
      min: Number(currentUrl.searchParams.get("min-viewsRange")) || 0,
      max: Number(currentUrl.searchParams.get("max-viewsRange")) || Infinity,
    },
    likesRange: {
      title: "Диапазон лайков",
      isLoading: true,
      error: null,
      minAvailable: 0,
      maxAvailable: Infinity,
      min: Number(currentUrl.searchParams.get("min-likesRange")) || 0,
      max: Number(currentUrl.searchParams.get("max-likesRange")) || Infinity,
    },
    sortLabel: currentUrl.searchParams.get("sortLabel") as keyof typeof sortConfig || Object.keys(sortConfig)[0],
    sort: Object.values(sortConfig)[0],
    filteredAdvertisements: null,
  };
  prepare.sort = sortConfig[prepare.sortLabel];

  return prepare;
})();

export const reducer = <S extends typeof initialSettings, T extends keyof typeof initialSettings>(settings: S, action: { type: T, value: S[T] }) => {
  if (action.type === "sortLabel") {
    settings.sortLabel = (Array.from(action.value.target.children).find((element) => element.selected)).value;
    currentUrl.searchParams.set("sortLabel", settings.sortLabel);
    settings.sort = sortConfig[settings.sortLabel];
    settings.page = 1;
  } else {
    settings[action.type] = action.value;
    if (action.type === "query" && typeof action.value === "string" && action.value.length > 2) {
      !settings.searchHistory.includes(action.value) && settings.searchHistory.unshift(action.value);
      settings.searchHistory.length = Math.min(5, settings.searchHistory.length);
      localStorage.setItem("searchHistory", JSON.stringify(settings.searchHistory));
    }
    if (action.type.endsWith("Range")) {
      const rangeLink = settings[action.type] as Range;
      currentUrl.searchParams.set("max-" + action.type, "" + rangeLink.max);
    }
  }

  if (action.type === "page"
    || action.type === "paginationSize"
    || action.type === "query"
  ) {
    currentUrl.searchParams.set(action.type, "" + settings[action.type]);
  }

  /** workarount for happy-dom */
  try {
    window?.history?.replaceState(null, "", currentUrl);
  } catch(error) {
    console.error(error);
  }

  return { ...settings };
};

export const updateMinMaxValues = <F extends string>(isLoading: boolean, error: unknown, { maxValueItem, field, rangeLink }: { maxValueItem: { data: { [key in F]: number }[] }, field: F, rangeLink: Range }) => {
  if (!isLoading && !error) {
    rangeLink.maxAvailable = maxValueItem?.data?.[0]?.[field];
    if (rangeLink.max === Infinity) {
      rangeLink.max = rangeLink.maxAvailable;
    }
  }
};
