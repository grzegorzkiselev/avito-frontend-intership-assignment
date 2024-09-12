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
  const [isCustomLoading, setIsCustomLoading] = useState(() => true);

  const timerId = useRef(null);

  /** @todo reuse this logic */
  useEffect(() => {
    setIsCustomLoading(() => true);

    if (
      settings.forItem
      && !isAllItemsLoading
      && !allItemsError
    ) {

      settings.filteredOrders = [];

      timerId.current = setTimeout(() => {
        for (const order of allItems) {
          for (const item of order.items) {
            if (item.id == settings.forItem) {
              settings.filteredOrders.push(order);
              break;
            }
          }
        }

        console.log(settings.filteredOrders);

        pagesCount = Math.ceil(settings.filteredOrders.length / settings.paginationSize);

        dispatch({ type: "pagesCount", value: pagesCount });

        setIsCustomLoading(() => false);
      }, 0);
    } else {
      settings.filteredOrders = null;
    }

    if (!isLoading && !error && data) {
      const pagesCount = data.pages;
      dispatch({ type: "pagesCount", value: pagesCount });
      setIsCustomLoading(() => false);
    }

    return () => {
      clearTimeout(timerId.current);
    };
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
          isLoading || isCustomLoading
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
