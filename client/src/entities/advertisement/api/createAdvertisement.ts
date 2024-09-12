import { ADVERTISEMENTS_PROPS, getServiceAxios } from "../../../shared";
import { Advertisement } from "../model/";

type AdvertisementDraft = Omit<Advertisement, "id">;

export class AdvertisementConstructor implements AdvertisementDraft {
  name = "";
  description = "";
  price = 0;
  createdAt = (new Date()).toISOString();
  likes = 0;
  views = 0;
  imageUrl = "";
  constructor(props: AdvertisementDraft) {
    for (const [key, value] of Object.entries(props)) {
      if (value) {
        this[key as keyof typeof props] = value;
      }
    }
  }
}

export const createAdvertisement = (advertisement: Partial<Advertisement>): Promise<Advertisement> => {
  return getServiceAxios()
    .post<Advertisement>(ADVERTISEMENTS_PROPS.endpoint, advertisement)
    .then(({ data }) => data);
};
