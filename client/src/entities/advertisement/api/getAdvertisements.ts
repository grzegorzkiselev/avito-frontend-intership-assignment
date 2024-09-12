import { ADVERTISEMENTS_PROPS } from "../../../shared";
import { PaginatedResponse } from "../../../shared/api/json-server/PaginatedResponse";
import { getServiceAxios } from "../../../shared/api/service-axios";
import { Advertisement } from "../model";

export const getAdvertisements = (params: string): Promise<PaginatedResponse<Advertisement[]>> => {
  return getServiceAxios()
    .get(ADVERTISEMENTS_PROPS.endpoint + params)
    .then(({ data }) => data);
};
