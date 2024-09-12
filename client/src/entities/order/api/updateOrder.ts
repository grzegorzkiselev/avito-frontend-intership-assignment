import { ORDERS_PROPS } from "../../../shared";
import { getServiceAxios } from "../../../shared/api/service-axios";
import { Order } from "../model";

export const updateOrder = (order: Partial<Order>) => {
  return getServiceAxios()
    .patch(ORDERS_PROPS.endpoint + "/" + order.id, order)
    .then(({ data }) => data);
};
