import { Autocomplete, rem } from "@mantine/core";
import { useEventListener } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";

export const Search = (
  { value, onSearchChange, suggestions }
  : { value: string, onSearchChange: (arg0: string) => void, suggestions?: string[], },
) => {
  const applyChanges = (event: Event) => {
    onSearchChange((event?.currentTarget as HTMLInputElement).value);
  };
  const ref = useEventListener("change", applyChanges);

  return <Autocomplete
    ref={ref}
    defaultValue={value}
    size="lg"
    placeholder="Поиск"
    radius="md"
    leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
    data={suggestions?.map((suggestion) => ({ label: suggestion, value: suggestion }))}
    visibleFrom="s"
  />;
};
