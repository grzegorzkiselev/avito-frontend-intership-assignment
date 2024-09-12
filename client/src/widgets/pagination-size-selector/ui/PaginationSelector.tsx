import { SegmentedControl, Text } from "@mantine/core";
import { useState } from "react";

export const PaginationSelector = ({ value, dispatch }) => {
  const [selectedPaginationOption, setSelectedPaginationOption] = useState(value);
  const handlePaginationSizeChange = (event) => {
    setSelectedPaginationOption(event);
    dispatch({ type: "paginationSize", value: event });
  };

  return <div style={{ "display": "grid" }}>
    <Text size="sm" fw={500} mb={8}>
      Объявлений на странице
    </Text>
    <SegmentedControl
      style={{ "width": "auto" }}
      value={selectedPaginationOption.toString()}
      onChange={handlePaginationSizeChange}
      data={["10", "25", "50", "100"]}
    />
  </div>;
};
