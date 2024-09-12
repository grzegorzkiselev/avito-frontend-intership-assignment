import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ORDERS_PROPS } from "../../../shared";
import { updateOrder } from "../api";
import { Order } from "./Order";

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (order: Partial<Order>) => updateOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_PROPS.endpoint] });

      notifications.show({
        title: "Заказ успешно обновлён",
        message: "",
      });
    },
    onError: (error) => {
      notifications.show({
        color: "red",
        title: "Не удалось обновить заказ",
        message: "Удачи разобраться: " + error?.message,
      });
    },
  });

  return { mutate, isPending };
};
