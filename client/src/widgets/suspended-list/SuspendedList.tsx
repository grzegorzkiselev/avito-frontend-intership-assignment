import { Center, Text } from "@mantine/core";
import { Pagination } from "../";
import { CenteredLoader, ErrorMessage } from "../../shared";

export const SuspendedList = ({ settings, isLoading, dispatch, error, items, mapper }) => {
  return isLoading
    ? <CenteredLoader />
    : error
      ? <ErrorMessage>{ JSON.stringify(error, null, 2) }</ErrorMessage>
      : !items || items.length === 0
        ? <Center style={{ "flexGrow": "1" }}><Text>Ничего не найдено, попробуйте изменить фильтр</Text></Center>
        : <>{
          items.map(mapper)
        }
        <Pagination page={settings.page} pagesCount={settings.pagesCount} dispatch={dispatch} />
        </>;
};
