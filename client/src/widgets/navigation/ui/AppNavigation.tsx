import { Card, Group } from "@mantine/core";
import { ADVERTISEMENTS_PROPS, AppLogotype, BASE_ROOT, ORDERS_PROPS } from "../../../shared";
import { NavigationLink } from "../../../shared/";

export const AppNavigation = ({ links }) => {
  return <Card withBorder radius="md" p="s">
    <Group mb="md">
      <AppLogotype />
    </Group>
    { links ? links : <>
      <NavigationLink to={BASE_ROOT + ADVERTISEMENTS_PROPS.slug}>{ADVERTISEMENTS_PROPS.title}</NavigationLink>
      <NavigationLink to={BASE_ROOT + ORDERS_PROPS.slug}>{ORDERS_PROPS.title}</NavigationLink>
    </>
    }
  </Card>;
};
