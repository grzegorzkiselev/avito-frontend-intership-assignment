import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdvertisements } from "../../../entities";
import { ADVERTISEMENTS_PROPS, DEFAULT_PAGINATION_SIZE } from "../../../shared";
import { initialSettings } from "./filterSettings";

export const useAdvertisements = ({ page, paginationSize, sort, priceRange, likesRange, viewsRange }: typeof initialSettings) => {
  const queryClient = useQueryClient();
  const params = new URLSearchParams();

  priceRange?.min && params.set("price_gte", "" + priceRange.min);
  Number.isFinite(priceRange?.max) && params.set("price_lte", "" + priceRange.max);

  likesRange?.min && params.set("likes_gte", "" + likesRange.min);
  Number.isFinite(likesRange?.max) && params.set("likes_lte", "" + likesRange.max);

  viewsRange?.min && params.set("views_gte", "" + viewsRange.min);
  Number.isFinite(viewsRange?.max) && params.set("views_lte", "" + viewsRange.max);

  sort && sort.by && params.set("_sort", (sort.direction === "desc" ? "-" : "") + sort.by);

  const paramsWithoutPagination = params.toString();

  const {
    data: allItems,
    isLoading: isAllItemsLoading,
    error: allItemsError,
  } = useQuery({
    queryKey: [ADVERTISEMENTS_PROPS.endpoint, paramsWithoutPagination],
    queryFn: () => getAdvertisements("?" + paramsWithoutPagination),
  });

  paginationSize = paginationSize ?? DEFAULT_PAGINATION_SIZE;
  params.set("_page", "" + page);
  params.set("_per_page", "" + paginationSize);

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ADVERTISEMENTS_PROPS.endpoint, params.toString()],
    queryFn: () => getAdvertisements("?" + params.toString()),
  });

  const baseParamsEntries = params.entries();

  const nextPageParams = new URLSearchParams([
    ...baseParamsEntries,
    ["_page", String(page + 1)],
    ["_per_page", "" + paginationSize],
  ]);

  queryClient.prefetchQuery({
    queryKey: [ADVERTISEMENTS_PROPS.endpoint, nextPageParams.toString()],
    queryFn: () => getAdvertisements("?" + nextPageParams.toString()),
  });

  if (page > 1) {
    const previousPageParams = new URLSearchParams([
      ...baseParamsEntries,
      ["_page", String(page - 1)],
      ["_per_page", "" + paginationSize],
    ]);

    queryClient.prefetchQuery({
      queryKey: [ADVERTISEMENTS_PROPS.endpoint, previousPageParams.toString()],
      queryFn: () => getAdvertisements("?" + previousPageParams.toString()),
    });
  }

  return { data, allItems, isLoading, isAllItemsLoading, error, allItemsError };
};
