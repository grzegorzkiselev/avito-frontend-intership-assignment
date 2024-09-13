import { useQuery } from "@tanstack/react-query";
import { DEFAULT_PAGINATION_SIZE, ORDERS_PROPS, queryClient } from "../../../shared";
import { getOrders } from "../api";

export const useOrders = ({ page, paginationSize, sort, status }) => {
  const params = new URLSearchParams();
  sort && sort.by && params.set("_sort", (sort.direction === "desc" ? "-" : "") + sort.by);
  status >= 0 && params.set("status", "" + status);

  const paramsWithoutPagination = params.toString();

  const {
    data: allItems,
    isLoading: isAllItemsLoading,
    error: allItemsError,
  } = useQuery({
    queryKey: [ORDERS_PROPS.endpoint, paramsWithoutPagination],
    queryFn: () => getOrders("?" + paramsWithoutPagination),
  });

  paginationSize = paginationSize ?? DEFAULT_PAGINATION_SIZE;
  params.set("_page", "" + page);
  params.set("_per_page", "" + paginationSize);

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ORDERS_PROPS.endpoint, params.toString()],
    queryFn: () => getOrders("?" + params.toString()),
  });

  const baseParamsEntries = params.entries();

  const nextPageParams = new URLSearchParams([
    ...baseParamsEntries,
    ["_page", String(page + 1)],
    ["_per_page", "" + paginationSize],
  ]);

  queryClient.prefetchQuery({
    queryKey: [ORDERS_PROPS.endpoint, nextPageParams.toString()],
    queryFn: () => getOrders("?" + nextPageParams.toString()),
  });

  if (page > 1) {
    const previousPageParams = new URLSearchParams([
      ...baseParamsEntries,
      ["_page", String(page - 1)],
      ["_per_page", "" + paginationSize],
    ]);

    queryClient.prefetchQuery({
      queryKey: [ORDERS_PROPS.endpoint, previousPageParams.toString()],
      queryFn: () => getOrders("?" + previousPageParams.toString()),
    });
  }

  return { data, isLoading, error, allItems, isAllItemsLoading, allItemsError };
};
