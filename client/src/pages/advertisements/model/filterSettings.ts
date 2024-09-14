import { Advertisement } from "../../../entities";
import { DEFAULT_PAGINATION_SIZE } from "../../../shared";
import { Range, SortConfig, SortOption } from "../../../widgets";

/** not a double with ¹, just a considence, no need to deduplicate */
export const filterableFields = ["price", "views", "likes"] as const;

/** ¹ */
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

export const initialSettings = ((currentUrl) => {
  const prepare: {
    /**
     * State specific
     */
    currentUrl: URL
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

    /**
     * Filtering by range specific
     * for different pages it should be different
     * so we need to figure out how to make it
     * configurable
     * @todo combine into single array
     */
    priceRange: Range,
    viewsRange: Range,
    likesRange: Range,

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
    filteredItems: {
      items: unknown[],

      /**
       * Method to get current page will be useful
       */
      getSliceForCurrentPage: () => void
    },
    filteredAdvertisements: Advertisement[] | null

    /**
     * Here custom filtering is used for searching
     * in items names
     */
    query: string,
    searchHistory: string[],
  } = {
    query: currentUrl.searchParams.get("query") || "",
    searchHistory: (() => {
      try {
        return JSON.parse(localStorage.getItem("searchHistory") || "") || [];
      } catch(error) {
        return [];
      }
    })(),
    currentUrl: currentUrl,
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
    /** @todo rewire */
    sortConfig: sortConfig,
    sortLabel: currentUrl.searchParams.get("sortLabel") as keyof typeof sortConfig || Object.keys(sortConfig)[0],
    sort: Object.values(sortConfig)[0],
    filteredAdvertisements: null,
    filteredItems: {
      items: [],
      getSliceForCurrentPage: function() {
        const start = (this.page - 1) * this.paginationSize;
        return this.filteredItems.items.slice(
          start,
          start + this.paginationSize,
        );
      },
    },
  };
  prepare.sort = sortConfig[prepare.sortLabel];
  prepare.filteredItems.getSliceForCurrentPage = prepare.filteredItems.getSliceForCurrentPage.bind(prepare);

  return prepare;
})(new URL(window.location.href));

/**
 * Is used only for getting ranges for *Range filters
 */
export const updateMinMaxValues = <F extends string>(isLoading: boolean, error: unknown, { maxValueItem, field, rangeLink }: { maxValueItem: { data: { [key in F]: number }[] }, field: F, rangeLink: Range }) => {
  if (!isLoading && !error) {
    rangeLink.maxAvailable = maxValueItem?.data?.[0]?.[field];
    if (rangeLink.max === Infinity) {
      rangeLink.max = rangeLink.maxAvailable;
    }
  }
};

export { reducer } from "../../../widgets";
