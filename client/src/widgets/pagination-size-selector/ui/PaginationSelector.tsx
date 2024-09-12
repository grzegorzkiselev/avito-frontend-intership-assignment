import { SegmentedControl, Text } from "@mantine/core";

export const PaginationSelector = ({ value, dispatch }) => {
  const handlePaginationSizeChange = (event) => {
    dispatch({ type: "paginationSize", value: event });
  };

  return <div style={{ "display": "grid" }}>
    <Text size="sm" fw={500} mb={8}>
      Объявлений на странице
    </Text>
    <SegmentedControl
      style={{ "width": "auto" }}
      value={value.toString()}
      onChange={handlePaginationSizeChange}
      data={["10", "25", "50", "100"]}
    />
  </div>;
};
