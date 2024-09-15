import { RangeSlider, Text } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { Dispatch, ReactNode } from "react";
import { Range } from "../model";

export const RangeSelector = (
  { children, dispatch, range }
  : {
    children: ReactNode,
    dispatch: Dispatch<unknown>,
    range: Range,
  },
) => {
  const handleRangeChange = useDebouncedCallback((event) => {
    dispatch({ type: range.id, value: { ...range, min: event[0], max: event[1] } });
  }, 1000);

  return <div>
    <Text size="sm" fw={500} mb={8}>
      { children }
    </Text>
    <RangeSlider
      onChange={handleRangeChange}
      size="sm"
      minRange={1}
      min={range.minAvailable}
      max={range.maxAvailable}
      step={1}
      defaultValue={[range.min, range.max]}
    />
  </div>;
};
