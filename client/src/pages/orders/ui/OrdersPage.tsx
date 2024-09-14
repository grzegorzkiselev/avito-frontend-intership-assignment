import { NativeSelect, Stack } from "@mantine/core";
import { useEffect, useReducer, useState } from "react";
import { AppSlots } from "../../../app";
import { OrderCard } from "../../../entities";
import { DEFAULT_PAGINATION_OPTIONS } from "../../../shared";
import { PaginationSelector, SuspendedList } from "../../../widgets";
import { OrdersPageParams, useOrders } from "../model";

const mapper = (order) => {
  return <OrderCard {...order} key={"order-" + order.id}/>;
};

const findIncludes = (forItem, allItems, doneSignal) => {
  return () => {
    const filteredOrders = [];
    for (const order of allItems) {
      for (const item of order.items) {
        if (item.id == forItem) {
          filteredOrders.push(order);
          break;
        }
      }
    }

    doneSignal();
    return filteredOrders;
  };

  // const pagesCount = Math.ceil(filteredOrders.length / settings.paginationSize) || 1;
  // dispatch({ type: "pagesCount", value: pagesCount });
  // dispatch({ type: "filteredOrders", value: filteredOrders });
  // setIsCustomLoading(() => false);
  // clearTimeout(timerId);
};

// const timerId = null;

export const OrdersPage = () => {
  const pageParams = new OrdersPageParams();
  const [settings, dispatch] = useReducer(pageParams.reducer, pageParams);
  const { data, isLoading, error, allItems, isAllItemsLoading, allItemsError } = useOrders(settings);
  const [isCustomLoading, setIsCustomLoading] = useState(true);

  if (!settings.forItem) {
    if (!isLoading && !error && data) {
      settings.pagesCount = data.pages;
    }
  }

  useEffect(() => {
    if (
      settings.forItem
      && !isAllItemsLoading
      && !allItemsError
    ) {
      setIsCustomLoading(() => true);
      dispatch({
        type: "forItem",
        value: {
          filterFunction: findIncludes(
            settings.forItem,
            allItems,
            () => setIsCustomLoading(() => false),
          ),
        } });
    }
  }, [allItems, isAllItemsLoading, allItemsError]);

  const handleSortChange = (event) => {
    dispatch({ type: "sortLabel", value: event });
  };
  const handleStatusChanged = (event) => {
    dispatch({ type: "statusLabel", value: event });
  };

  return <AppSlots
    adaptiveSidebar={
      <Stack>
        <PaginationSelector paginationOptions={DEFAULT_PAGINATION_OPTIONS} value={settings.paginationSize} dispatch={dispatch} />
        <NativeSelect
          value={settings.sortLabel}
          onChange={handleSortChange}
          label="Сортировать"
          data={Object.keys(settings.sortConfig)}
        />
        <NativeSelect
          value={settings.statusLabel}
          onChange={handleStatusChanged}
          label="Со статусом"
          data={settings.statusLables}
        />
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
            ? settings.filteredItems.getSliceForCurrentPage()
            : data?.data
        }
      />

    </Stack>
  </AppSlots>;
};
