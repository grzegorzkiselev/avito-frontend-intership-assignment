import { Autocomplete, rem } from "@mantine/core";
import { useEventListener } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";

export const Search = (
  { value, type, dispatch, suggestions }: { value: string, type: string, suggestions?: string[], dispatch: Dispatch<unknown> } = {},
) => {
  const applyChanges = (event) => {
    dispatch({ type, value: event.currentTarget.value });
  };
  const ref = useEventListener("change", applyChanges);

  return <Autocomplete
    ref={ref}
    defaultValue={value}
    size="lg"
    placeholder="Поиск"
    radius="md"
    leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
    data={suggestions.map((suggestion) => ({ label: suggestion, value: suggestion }))}
    visibleFrom="s"
  />;
};
