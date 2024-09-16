import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Advertisement, createAdvertisement } from "../../../entities";
import { ADVERTISEMENTS_PROPS } from "../../../shared";

export const useCreateAdvertisement = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (advertisement: Partial<Advertisement>) => createAdvertisement(advertisement),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: [ADVERTISEMENTS_PROPS.endpoint] });

      notifications.show({
        title: "Изменения сохранены",
        message: "",
      });
    },
    onError: (error) => {
      console.error(error);
      notifications.show({
        color: "red",
        title: "Произошла ошибка",
        message: "Удачи разобраться: " + error?.message,
      });
    },
  });

  return { mutate, isPending };
};
