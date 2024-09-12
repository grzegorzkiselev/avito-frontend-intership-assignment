import { Center, NativeSelect, Stack, Text } from "@mantine/core";
import { useReducer, useState } from "react";
import { AppSlots } from "../../../app";
import { OrderCard } from "../../../entities";
import { CenteredLoader, DEFAULT_PAGINATION_OPTIONS, ErrorMessage } from "../../../shared";
import { Pagination, PaginationSelector } from "../../../widgets";
import { initialSettings, reducer, sortConfig, statusSelectConfig, useOrders } from "../model";

const mapper = (order) => {
  return <OrderCard {...order} key={"order-" + order.id}/>;
}

let timerId = null;
export const OrdersPage = () => {
  const [settings, dispatch] = useReducer(reducer, initialSettings);
  const { data, isLoading, error, allItems, isAllItemsLoading, allItemsError } = useOrders(settings);
  const [isCustomLoading, setIsCustomLoading] = useState(true);

  const conditionalListRenderer = (isLoading, items, error) => {
   return isLoading
    ? <CenteredLoader />
    : error
      ? <ErrorMessage>{ JSON.stringify(error, null, 2) }</ErrorMessage>
      : items.length === 0
        ? <Center style={{ "flexGrow": "1" }}><Text>Ничего не найдено, попробуйте изменить фильтр</Text></Center>
        : <>{
          items.map(mapper)
        }
        <Pagination page={settings.page} pagesCount={settings.pagesCount} dispatch={dispatch} />
        </>
  }

  const findIncluded = () => {
    const filteredOrders = [];
    for (const order of allItems) {
      for (const item of order.items) {
        if (item.id == settings.forItem) {
          filteredOrders.push(order);
          break;
        }
      }
    }
    const pagesCount = Math.ceil(filteredOrders.length / settings.paginationSize);
    dispatch({ type: "pagesCount", value: pagesCount });
    dispatch({ type: "filteredOrders", value: filteredOrders });
    setIsCustomLoading(() => false)
    clearTimeout(timerId);
  }

  if (settings.forItem) {
    if (
      !isAllItemsLoading
      && !allItemsError
      && allItems
      && !settings.filteredOrders
    ) {
      if (!timerId) {
        timerId = setTimeout(findIncluded);
      }
    }
  } else {
    settings.filteredOrders = null;
    if (!isLoading && !error && data) {
      settings.pagesCount = data.pages;
    }
  }

  const first = (settings.page - 1) * settings.paginationSize;
  const last = first + settings.paginationSize;

  return <AppSlots
    adaptiveSidebar={
      <Stack>
        <PaginationSelector paginationOptions={DEFAULT_PAGINATION_OPTIONS} value={settings.paginationSize} dispatch={dispatch} />
        <NativeSelect value={settings.sortLabel} onChange={(event) => dispatch({ type: "sortLabel", value: event })} label="Сортировать" data={Object.getOwnPropertyNames(sortConfig)} />
        <NativeSelect value={settings.statusLabel} onChange={(event) => dispatch({ type: "statusLabel", value: event })} label="Со статусом" data={statusSelectConfig} />
      </Stack>
    }
  >
    <Stack>
      <>
        {
        settings.forItem
        ? conditionalListRenderer(isCustomLoading, settings.filteredOrders?.slice(first, last), allItemsError)
        : conditionalListRenderer(isLoading, data?.data, error)
      }
      </>
    </Stack>
  </AppSlots>;
};
