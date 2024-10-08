import { Button, Modal, NavLink as StyledNavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useParams } from "react-router-dom";
import { AppSlots } from "../../../app/layout";
import { AdvertisementCard, CreateUpdateAdvertisementCard } from "../../../entities";
import { ADVERTISEMENTS_PROPS, CenteredLoader, ErrorMessage, ORDERS_PROPS } from "../../../shared";
import { useSingleAdvertisement } from "../model/useSingleAdvertisement";

export const AdvertisementPage = () => {
  const { id } = useParams();
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const { data, isLoading, error } = useSingleAdvertisement({ id } as { id: string });

  return <AppSlots
    links={
      <>
        <StyledNavLink href={"../" + ADVERTISEMENTS_PROPS.slug + "/"} label="Объявления" component="a" />
        <StyledNavLink to={"../" + ORDERS_PROPS.slug + "/"} label="Заказы" component={Link} />
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
        : error
          ? <ErrorMessage>{ JSON.stringify(error, null, 2) }</ErrorMessage>
          : data ? <AdvertisementCard bottom={true} { ...data } />
            : <ErrorMessage>Не удалось загрузить объявление</ErrorMessage>
    }
  </AppSlots>;
};
