import { Button, Modal, NavLink as StyledNavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useParams } from "react-router-dom";
import { AppSlots } from "../../../app/layout";
import { AdvertisementCard, CreateUpdateAdvertisementCard } from "../../../entities";
import { ADVERTISEMENTS_PROPS, CenteredLoader, ORDERS_PROPS } from "../../../shared";
import { useSingleAdvertisement } from "../model/useSingleAdvertisement";

export const AdvertisementPage = () => {
  const { id } = useParams();
  // const isMobile = useContext(MediaQueryContext);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const { data, isLoading } = useSingleAdvertisement({ id } as { id: string });

  return <AppSlots
    links={
      <>
        <StyledNavLink href={"../" + ADVERTISEMENTS_PROPS.slug + "/"} label="Объявления" component="a" />
        <StyledNavLink to={ORDERS_PROPS.slug + "/"} label="Заказы" component={Link} />
      </>
    }
    sidebar={
      <>
        <Modal opened={modalOpened} onClose={closeModal}>
          <CreateUpdateAdvertisementCard advertisement={{ ...data }} close={closeModal} />
        </Modal>
        <Button onClick={openModal}>Редактировать объявление</Button>
      </>
    }
  >
    {
      isLoading
        ? <CenteredLoader />
        : <AdvertisementCard bottom={true} { ...data } />
    }
  </AppSlots>;
};

// return <Grid>
//   <Grid.Col mb="md" span="auto">
//     <Stack style={{
//       "position": isMobile ? "static" : "sticky",
//       "top": isMobile ? "auto" : "var(--mantine-spacing-xl)",
//     }}>
//       <Stack style={{
//         "position": isMobile ? "static" : "sticky",
//         "top": isMobile ? "auto" : "var(--mantine-spacing-xl)",
//       }}>
//         <Card withBorder radius="md" p="s">
//           <Group mb="md">
//             <AppLogotype />
//           </Group>
//           <StyledNavLink href={"../" + ADVERTISEMENTS_PROPS.slug + "/"} label="Объявления" component="a" />
//           <StyledNavLink to={ORDERS_PROPS.slug + "/"} label="Заказы" component={Link} />
//         </Card>
//         <Modal opened={modalOpened} onClose={closeModal}>
//           <CreateUdateAdvertisementCard advertisement={ data ? { id: data.id, name: data.name, price: data.price, description: data.description, imageUrl: data.imageUrl } : null } close={closeModal} />
//         </Modal>
//         <Button onClick={openModal}>Редактировать объявление</Button>
//       </Stack>
//     </Stack>
//   </Grid.Col>
//   <Grid.Col span={isMobile ? 12 : 8 } >
//     {
//       isLoading
//         ? <CenteredLoader />
//         : <AdvertisementCard bottom={true} {...data } />
//     }
//   </Grid.Col>
// </Grid>;
