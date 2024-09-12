import { ADVERTISEMENTS_PROPS, getServiceAxios } from "../../../shared";
import { Advertisement } from "../model";

export const getAdvertisement = (id: string): Promise<Advertisement> => {
  return getServiceAxios()
    .get(ADVERTISEMENTS_PROPS.endpoint + "/" + id)
    .then(({ data }) => data);
};
