import { Alert, Center, NativeSelect, Stack, Text } from "@mantine/core";
import { useEffect, useReducer, useRef, useState } from "react";
import { AppSlots } from "../../../app";
import { OrderCard } from "../../../entities";
import { CenteredLoader, DEFAULT_PAGINATION_OPTIONS } from "../../../shared";
import { Pagination, PaginationSelector } from "../../../widgets";
import { initialSettings, reducer, sortConfig, statusSelectConfig, useOrders } from "../model";

export const OrdersPage = () => {
  const [settings, dispatch] = useReducer(reducer, initialSettings);
  const { data, isLoading, error, allItems, isAllItemsLoading, allItemsError } = useOrders(settings);
  const [isCustomLoading, setIsCustomLoading] = useState(true);

  const timerId = useRef(null);
  const findIncludesItem = () => {
    const filteredOrders = [];
    for (const order of allItems) {
      for (const item of order.items) {
        if (item.id == settings.forItem) {
          filteredOrders.push(order);
          break;
        }
      }
    }
    settings.filteredOrders = filteredOrders;
    const pagesCount = Math.ceil(settings.filteredOrders.length / settings.paginationSize);
    dispatch({ type: "pagesCount", value: pagesCount });
    setIsCustomLoading(() => false);
  }

  /** @todo reuse this logic */
  useEffect(() => {
    if (!settings.forItem) {
      setIsCustomLoading(() => false);
      settings.filteredOrders = null;

      if (!isLoading && !error && data) {
        dispatch({ type: "pagesCount", value: data.pages });
      }
    }

    if (
      settings.forItem
      && !isAllItemsLoading
      && !allItemsError
    ) {
      setIsCustomLoading(() => true);
      timerId.current = setTimeout(findIncludesItem);
    }

    return () => { clearTimeout(timerId.current) }
  }, [data, isLoading, error, allItems, isAllItemsLoading, allItemsError]);

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
          (console.log(isCustomLoading, isLoading), isCustomLoading || isLoading)
            ? <CenteredLoader />
            : error
              ? <Alert variant="light" color="red" radius="md">
                { JSON.stringify(error, null, 2) }
              </Alert>
              : (settings.filteredOrders || data.data).length === 0
                ? <Center style={{ "flexGrow": "1" }}><Text>Ничего не найдено, попробуйте изменить фильтр</Text></Center>
                : <>{
                  (settings.filteredOrders || data.data).map((order) => {
                    return <OrderCard {...order} key={"order-" + order.id}/>;
                  })}
                <Pagination page={settings.page} pagesCount={settings.pagesCount} dispatch={dispatch} />
                </>
        }
      </>
    </Stack>
  </AppSlots>;
};
