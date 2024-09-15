import { Reducer } from "react";
import { Range } from "../../";
import { ADVERTISEMENTS_PROPS, DEFAULT_PAGINATION_SIZE, useGetMinMaxValues } from "../../../shared";
import { defaultActions } from "./defaultActions";

export const sortDirectionLabels = ["asc", "desc"] as const;
export type SortOption = {
  by: string,
  direction: typeof sortDirectionLabels[number],
};
export type SortConfig = Record<string, SortOption>;

export abstract class PageParams {
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
  initialPagesCount: number = 1;

  /**
   * Sorting specific
   */
  sortLabel: string = "";
  sortOptions: SortOption[] = [];
  currentSortOption: SortOption = { by: "", direction: "desc" };
  sortConfig: SortConfig = {};

  /**
   * Filtering by range specific
   * for different pages it should be different
   * so we need to figure out how to make it
   * configurable
   * @todo combine into single array
   */
  ranges = [] as Range[];

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
    items: [] as unknown[],
    getSliceForCurrentPage: (settings: typeof this) => {
      const start = (settings.page - 1) * settings.paginationSize;
      return settings.filteredItems.items.slice(
        start,
        start + settings.paginationSize,
      );
    },
  };

  reducer: Reducer<typeof this, typeof defaultActions>;

  initSort = (sortConfig: SortConfig) => {
    this.sortConfig = sortConfig;
    const [defaultSortLabel, defaultSortOption] = Object.entries(this.sortConfig)[0];
    this.sortLabel = this.currentUrl.searchParams.get("sortLabel") || defaultSortLabel;
    this.currentSortOption = this.sortConfig[this.sortLabel] || defaultSortOption;
  };

  initRanges = (ranges: Range[]) => ranges.forEach((range) => {
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
}
