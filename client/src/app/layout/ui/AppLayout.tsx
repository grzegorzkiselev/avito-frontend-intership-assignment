import { Container, px } from "@mantine/core";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { MediaQueryContext } from "../../providers";
import classes from "./App.module.css";

export const AppLayout = ({ children } = {}) => {
  const isMobile = useContext(MediaQueryContext);

  return (
    <Container className={classes.container} px={isMobile ? "xs" : "xl"} pt="xl" pb={px("5rem")}>
      { children ? children : <Outlet /> }
    </Container>
  );
};
