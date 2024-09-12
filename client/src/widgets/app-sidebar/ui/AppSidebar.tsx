import { Stack } from "@mantine/core";
import { AppNavigation } from "../../";

export const AppSidebar = ({ isMobile, children, links }) => {
  return <Stack style={{
    "position": isMobile ? "static" : "sticky",
    "top": isMobile ? "auto" : "var(--mantine-spacing-xl)",
  }}>
    <AppNavigation links={links} />
    { children }
  </Stack>;
};
