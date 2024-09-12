import { NavLink as StyledNavLink } from "@mantine/core";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export const NavigationLink = ({ to, children }: { to: string, children: ReactNode }) => {
  return <StyledNavLink to={to} label={children} component={NavLink} />;
};
