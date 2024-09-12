import { Alert, Center, NativeSelect, Stack, Text } from "@mantine/core";
import { useEffect, useReducer } from "react";
import { AppSlots } from "../../../app";
import { OrderCard } from "../../../entities";
import { CenteredLoader, DEFAULT_PAGINATION_OPTIONS } from "../../../shared";
import { Pagination, PaginationSelector } from "../../../widgets";
import { initialSettings, reducer, sortConfig, statusSelectConfig, useOrders } from "../model";

export const OrdersPage = () => {
  const [settings, dispatch] = useReducer(reducer, initialSettings);
  const { data, isLoading, error } = useOrders(settings);

  /** @todo reuse this logic */
  useEffect(() => {
    if (!isLoading && !error && data) {
      let pagesCount = data.pages;

      if (settings.forItem) {
        settings.filteredOrders = [];
        for (const order of data.data) {
          for (const item of order.items) {

            if (item.id == settings.forItem) {
              settings.filteredOrders.push(order);
              break;
            }
          }
        }
        pagesCount = Math.ceil(settings.filteredOrders.length / settings.paginationSize);
      }

      dispatch({ type: "pagesCount", value: pagesCount });
    }
  }, [data, isLoading, data]);

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
          isLoading
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
