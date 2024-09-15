import { Center, Text } from "@mantine/core";
import { Dispatch } from "react";
import { PageParams, Pagination } from "../";
import { CenteredLoader, ErrorMessage } from "../../shared";

export const SuspendedList = (
  { settings, isLoading, dispatch, error, items, mapper }
  : {
    settings: PageParams,
    isLoading: boolean,
    dispatch: Dispatch<unknown>,
    error: null | unknown,
    items: unknown[],
    mapper: (arg0: unknown) => JSX.Element
  },
) => {
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
