import { em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { createContext, ReactNode } from "react";
import { BREAKPOINT } from "../../shared";

document.documentElement.style.setProperty("--breakpoint", BREAKPOINT + "px");

export const MediaQueryContext = createContext(false);
export const MediaQueryContextProvider = ({ children }: { children: ReactNode }) => {
  const isMobile = useMediaQuery(`(max-width: ${em(BREAKPOINT)})`);

  return <MediaQueryContext.Provider value={Boolean(isMobile)}>{ children }</MediaQueryContext.Provider>;
};
