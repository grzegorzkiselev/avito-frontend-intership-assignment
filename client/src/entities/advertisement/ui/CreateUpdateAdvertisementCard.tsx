import { Button, Card, Group, NumberInput, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedCallback } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useCreateAdvertisement, useUpdateAdvertisement } from "../../../pages/advertisement";
import { Image, imageUrlRegexp } from "../../../shared";
import { AdvertisementConstructor } from "../api";
import { Advertisement, validateNewAdvertisement } from "../model";
import classes from "./AdvertisementCard.module.css";

const restoreDraft = () => {
  const draft = localStorage.getItem("newAdvertisementDraft");
  if (typeof draft === "string") {
    return JSON.parse(draft);
  }
  return [];
};

const popstateHandler = () => {
  const urlToClean = new URL(window.location.href);
  urlToClean.searchParams.delete("query");
  urlToClean.searchParams.delete("min-priceRange");
  urlToClean.searchParams.delete("max-priceRange");
  window.location.href = urlToClean.href;
};

export const CreateUpdateAdvertisementCard = ({ advertisement, close }: { advertisement?: Partial<Advertisement>, close: () => void }) => {
  let mutate = null;
  let isPending = null;

  if (advertisement && advertisement.id) {
    ({ mutate, isPending } = useUpdateAdvertisement());
  } else {
    ({ mutate, isPending } = useCreateAdvertisement());
  }

  const form = useForm({
    mode: "uncontrolled",
    initialValues: advertisement ?? restoreDraft(),
    validate: {
      name: (value) => value.length < 2
        ? "Название должно содержать больше двух букв"
        : null,
      price: (value) => Number(value) < 0
        ? "Цена не может быть меньше нуля"
        : null,
      imageUrl: (value) => value?.length === 0
        ? null
        : imageUrlRegexp.test(value)
          ? null
          : "Поле подходит только для ссылок на картинки в форматах png, jpg, webp и avif",
    },
  });

  const saveDraftToLocalStorage = () => {
    localStorage.setItem("newAdvertisementDraft", JSON.stringify(form.getValues()));
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("newAdvertisementDraft");
  };

  const saveDraft = useDebouncedCallback(saveDraftToLocalStorage, 600);

  const handleSubmit = (event: Advertisement) => {
    form.validate();

    try {
      const newAdvertisementInstance = new AdvertisementConstructor(event);

      validateNewAdvertisement(newAdvertisementInstance);
      mutate(newAdvertisementInstance);

      if (!isPending) {
        form.reset();
        clearLocalStorage();
        close();
      }

      window.addEventListener("popstate", popstateHandler, { once: true });
    } catch(error) {
      notifications.show({
        color: "red",
        title: "Не удалось создать объявление",
        /** @todo ensure that error rendering won’t break the app */
        message: "Удачи разобраться: " + error,
      });
    }
  };

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image src={form.getValues().imageUrl} alt="" height={360} />
      </Card.Section>
      <form
        onChange={saveDraft}
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <Card.Section className={classes.section} mt="md">
          <Stack>
            <TextInput
              {...form.getInputProps("imageUrl")} key={form.key("imageUrl")} label="Ссылка на обложку" placeholder="https://my-awesome-goods.com/cover.jpg" fz="sm" fw={400}
            />
            <TextInput {...form.getInputProps("name")} key={form.key("name")} label="Название" placeholder="iPhone 16" fz="lg" fw={500} type="text"/>
            <NumberInput {...form.getInputProps("price")} key={form.key("price")} label="Цена" placeholder="123321" fz="md" fw={500}/>
            <Textarea {...form.getInputProps("description")} key={form.key("description")} label="Описание" placeholder="Восхитительный, ошеломительный" fz="sm" />
          </Stack>
        </Card.Section>
        <Card.Section className={classes.section}>
          <Group justify="end" mt="md">
            <Button type="submit">{ advertisement ? "Обновить" : "Создать" }</Button>
          </Group>
        </Card.Section>
      </form>
    </Card>
  );
};
