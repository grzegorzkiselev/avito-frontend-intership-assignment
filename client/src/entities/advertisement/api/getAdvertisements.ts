import { ADVERTISEMENTS_PROPS, PaginatedResponse } from "../../../shared";
import { getServiceAxios } from "../../../shared/api/service-axios";
import { Advertisement } from "../model";

// (P["paged"] ? Promise<PaginatedResponse<Advertisement[]>> : Promise<Advertisement[]>)

export const getAdvertisements = <PAGED extends boolean>(params: string): PAGED extends true ? Promise<PaginatedResponse<Advertisement[]>> : Promise<Advertisement[]> => {
  return getServiceAxios()
    .get(ADVERTISEMENTS_PROPS.endpoint + params)
    .then(({ data }) => data);
};
