import { useQuery } from "@tanstack/react-query";
import { ADVERTISEMENTS_PROPS, getServiceAxios } from "../../../shared";

export const useGetMinMaxValues = (baseUrl: string, field: string) => {
  // const minEndpoint = new URL(baseUrl);
  // minEndpoint.searchParams.set("_limit", "" + 1);
  // minEndpoint.searchParams.set("_sort", "" + field);

  // const maxEndpoint = new URL(baseUrl);
  // maxEndpoint.searchParams.set("_limit", "" + 1);
  // maxEndpoint.searchParams.set("_sort", "-" + field);

  const minParams = new URLSearchParams();
  minParams.set("_limit", "" + 1);
  minParams.set("_sort", "" + field);

  const maxParams = new URLSearchParams();
  maxParams.set("_limit", "" + 1);
  maxParams.set("_sort", "-" + field);

  const {
    data: minValueItem,
    isLoading: minValueLoading,
    error: minValueError,
  } = useQuery({
    queryKey: [baseUrl, minParams.toString()],
    queryFn: () => getServiceAxios().get(ADVERTISEMENTS_PROPS.endpoint + "?" + minParams.toString()),
  });

  const {
    data: maxValueItem,
    isLoading: maxValueLoading,
    error: maxValueError,
  } = useQuery({
    queryKey: [baseUrl, maxParams.toString()],
    queryFn: () => getServiceAxios().get(ADVERTISEMENTS_PROPS.endpoint + "?" + maxParams.toString()),
  });

  return { minValueItem, maxValueItem, isMinMaxValuesLoading: minValueLoading || maxValueLoading, minMaxValueError: minValueError || maxValueError };
};
