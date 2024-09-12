import { ADVERTISEMENTS_PROPS, getServiceAxios } from "../../../shared";
import { Advertisement } from "../model";

export const updateAdvertisement = (advertisement: Partial<Advertisement>): Promise<Advertisement> => {
  return getServiceAxios()
    .patch<Advertisement>(new URL(ADVERTISEMENTS_PROPS.endpoint + "/" + advertisement.id).href, advertisement)
    .then(({ data }) => data);
};
