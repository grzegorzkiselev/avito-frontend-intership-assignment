import { useQuery } from "@tanstack/react-query";
import { ADVERTISEMENTS_PROPS } from "../../../shared";
import { getAdvertisement } from "../../../entities";

export const useSingleAdvertisement = ({ id }: { id: string }) => {

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ADVERTISEMENTS_PROPS.endpoint, id],
    queryFn: () => getAdvertisement(id),
  });

  return { data, isLoading, error };
};
