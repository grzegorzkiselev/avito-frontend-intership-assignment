import { RangeSlider, Text } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { Dispatch, ReactNode } from "react";

export type Range = {
  title: string,
  isLoading: boolean,
  error: unknown,
  minAvailable: number,
  maxAvailable: number,
  min: number,
  max: number,
};

export const RangeSelector = (
  { children, dispatch, settings }
  : {
    children: ReactNode,
    dispatch: Dispatch<unknown>,
    settings: Range,
  },
) => {
  const handleRangeChange = useDebouncedCallback((event) => {
    dispatch({ type: settings.id, value: { ...settings, min: event[0], max: event[1] } });
  }, 1000);

  return <div>
    <Text size="sm" fw={500} mb={8}>
      { children }
    </Text>
    <RangeSlider onChange={handleRangeChange} size="sm" minRange={1} min={settings.minAvailable} max={settings.maxAvailable} step={1} defaultValue={[settings.min, settings.max]} />
  </div>;
};
