import { NativeSelect, Stack } from "@mantine/core";
import { useEffect, useReducer, useState } from "react";
import { AppSlots } from "../../../app";
import { OrderCard } from "../../../entities";
import { DEFAULT_PAGINATION_OPTIONS } from "../../../shared";
import { PaginationSelector, SuspendedList } from "../../../widgets";
import { initialSettings, reducer, sortConfig, statusSelectConfig, useOrders } from "../model";

const mapper = (order) => {
  return <OrderCard {...order} key={"order-" + order.id}/>;
};

let timerId = null;
export const OrdersPage = () => {
  const [settings, dispatch] = useReducer(reducer, initialSettings);
  const { data, isLoading, error, allItems, isAllItemsLoading, allItemsError } = useOrders(settings);
  const [isCustomLoading, setIsCustomLoading] = useState(true);

  const findIncludes = () => {
    /**
     * () => {
     *   const filteredOrders = [];
     *   for (const order of allItems) {
     *     for (const item of order.items) {
     *       if (item.id == settings.forItem) {
     *         filteredOrders.push(order);
     *         break;
     *       }
     *     }
     *   }
     *  return filteredOrders;
     * }
     */
    const filteredOrders = [];
    for (const order of allItems) {
      for (const item of order.items) {
        if (item.id == settings.forItem) {
          filteredOrders.push(order);
          break;
        }
      }
    }
    const pagesCount = Math.ceil(filteredOrders.length / settings.paginationSize) || 1;
    dispatch({ type: "pagesCount", value: pagesCount });
    dispatch({ type: "filteredOrders", value: filteredOrders });
    setIsCustomLoading(() => false);
    clearTimeout(timerId);
  };

  useEffect(() => {
    setIsCustomLoading(() => true);
    if (settings.forItem) {
      timerId = setTimeout(findIncludes);
    }
    return () => clearTimeout(timerId);
  }, [allItems, isAllItemsLoading, allItemsError]);

  if (!settings.forItem) {
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

      <SuspendedList
        settings={settings}
        dispatch={dispatch}
        mapper={mapper}
        isLoading={
          settings.forItem
            ? isCustomLoading
            : isLoading
        }
        error={
          settings.forItem
            ? allItemsError
            : error
        }
        items={
          settings.forItem
            ? settings.filteredOrders?.slice(first, last)
            : data?.data
        }
      />

    </Stack>
  </AppSlots>;
};
