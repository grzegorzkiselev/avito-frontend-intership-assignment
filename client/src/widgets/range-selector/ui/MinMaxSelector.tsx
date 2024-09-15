import { Flex, NumberInput, Text } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { Dispatch, ReactNode } from "react";
import { Range } from "../model";

const style = {
  "flexGrow": "1",
};

export const MinMaxSelector = (
  { children, dispatch, range }
  : {
    children: ReactNode,
    dispatch: Dispatch<unknown>,
    range: Range,
  },
) => {
  const handleRangeChange = useDebouncedCallback((event, type) => {
    if (event === "") {
      event = type === "max" ? range.maxAvailable : range.minAvailable;
    }
    dispatch({ type: range.id, value: { ...range, [type]: event } });
  }, 1000);

  const minRange = 1;

  return <div>
    <Text size="sm" fw={500} mb={8}>
      { children }
    </Text>
    <Flex gap={8}>
      <NumberInput onChange={(event) => {
        handleRangeChange(event, "min");
      }}
      style={style}
      size="xs"
      placeholder={String(range.minAvailable)}
      min={range.minAvailable}
      max={range.maxAvailable - minRange}
      defaultValue={range.minAvailable}
      value={range.min}
      />
      <NumberInput onChange={(event) => {
        handleRangeChange(event, "max");
      }}
      style={style}
      size="xs"
      placeholder={String(range.maxAvailable)}
      min={range.minAvailable + minRange}
      max={range.maxAvailable}
      defaultValue={range.maxAvailable}
      value={range.max}
      />
    </Flex>
  </div>;
};

// <RangeSlider
//   onChange={handleRangeChange}
//   size="sm"
//   minRange={1}
//   min={range.minAvailable}
//   max={range.maxAvailable}
//   step={1}
//   defaultValue={[range.min, range.max]}
// />;
