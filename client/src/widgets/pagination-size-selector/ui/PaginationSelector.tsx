import { SegmentedControl, Text } from "@mantine/core";
import { Dispatch } from "react";

export const PaginationSelector = (
  { value, paginationOptions, dispatch }
  : { value: number, paginationOptions: string[], dispatch: Dispatch<unknown> },
) => {
  const handlePaginationSizeChange = (event: string) => {
    dispatch({ type: "paginationSize", value: Number(event) });
  };

  return <div style={{ "display": "grid" }}>
    <Text size="sm" fw={500} mb={8}>
      Объявлений на странице
    </Text>
    <SegmentedControl
      style={{ "width": "auto" }}
      value={String(value)}
      onChange={handlePaginationSizeChange}
      data={paginationOptions}
    />
  </div>;
};
