import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ReactNode } from "react";

export const UiProvider = ({ children }: { children: ReactNode }) => <MantineProvider>
  <Notifications/>
  { children }
</MantineProvider>;
