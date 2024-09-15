import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdvertisements } from "../../../entities";
import { ADVERTISEMENTS_PROPS, DEFAULT_PAGINATION_SIZE } from "../../../shared";
import { AdvertisementsPageParams } from "./filterSettings";

export const useAdvertisements = ({ page, paginationSize, currentSortOption, ranges }: AdvertisementsPageParams) => {
  const queryClient = useQueryClient();
  const params = new URLSearchParams();

  ranges?.forEach((range) => {
    range?.min && params.set(range.field + "_gte", "" + range.min);
    Number.isFinite(range?.max) && params.set(range.field + "_lte", "" + range.max);
  });

  currentSortOption
  && currentSortOption.by
  && params.set(
    "_sort",
    (currentSortOption.direction === "desc" ? "-" : "") + currentSortOption.by,
  );

  const paramsWithoutPagination = params.toString();

  const {
    data: allItems,
    isLoading: isAllItemsLoading,
    error: allItemsError,
  } = useQuery({
    queryKey: [ADVERTISEMENTS_PROPS.endpoint, paramsWithoutPagination],
    queryFn: () => getAdvertisements<false>("?" + paramsWithoutPagination),
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
    queryFn: () => getAdvertisements<true>("?" + params.toString()),
  });

  const baseParamsEntries = params.entries();

  const nextPageParams = new URLSearchParams([
    ...baseParamsEntries,
    ["_page", String(page + 1)],
    ["_per_page", "" + paginationSize],
  ]);

  queryClient.prefetchQuery({
    queryKey: [ADVERTISEMENTS_PROPS.endpoint, nextPageParams.toString()],
    queryFn: () => getAdvertisements<true>("?" + nextPageParams.toString()),
  });

  if (page > 1) {
    const previousPageParams = new URLSearchParams([
      ...baseParamsEntries,
      ["_page", String(page - 1)],
      ["_per_page", "" + paginationSize],
    ]);

    queryClient.prefetchQuery({
      queryKey: [ADVERTISEMENTS_PROPS.endpoint, previousPageParams.toString()],
      queryFn: () => getAdvertisements<true>("?" + previousPageParams.toString()),
    });
  }

  return { data, allItems, isLoading, isAllItemsLoading, error, allItemsError };
};
