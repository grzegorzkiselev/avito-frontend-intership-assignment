import { Button, Card, Drawer, Grid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ReactNode, useContext } from "react";
import { AppSidebar } from "../../../widgets";
import { MediaQueryContext } from "../../providers";
import classes from "./App.module.css";

export const AppSlots = ({
  links,
  adaptiveSidebar,
  sidebar,
  children,
}: {
  links?: ReactNode,
  children?: ReactNode,
  adaptiveSidebar?: ReactNode,
  sidebar?: ReactNode,
}) => {
  const isMobile = useContext(MediaQueryContext);
  const [opened, { open, close }] = useDisclosure(false);

  return <Grid className={isMobile ? classes.manitineGroupInnerOverride : classes.slotsWrapper}>
    <Grid.Col mb="md" span="auto">
      <AppSidebar isMobile={isMobile} links={links}>

        { adaptiveSidebar
          ? isMobile
            ? <>
              <Drawer offset={8} radius="md" opened={opened} onClose={close} position="bottom" title="Фильтр">
                {adaptiveSidebar}
              </Drawer>
              <Button variant="light" onClick={open}>Фильтр и сортировка</Button>
            </>
            : <Card
              className={classes.sidebar}
              withBorder radius="md" p="s">
              {adaptiveSidebar}
            </Card>
          : null
        }

        { sidebar ? sidebar : null }
      </AppSidebar>
    </Grid.Col>
    <Grid.Col span={isMobile ? 12 : 8 } className={classes.main} >
      { children ? children : null }
    </Grid.Col>
  </Grid>;
};