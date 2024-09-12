import { ORDERS_PROPS } from "../../../shared";
import { getServiceAxios } from "../../../shared/api/service-axios";

export const getOrders = (params) => {
  return getServiceAxios()
    .get(ORDERS_PROPS.endpoint + params)
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });
};
