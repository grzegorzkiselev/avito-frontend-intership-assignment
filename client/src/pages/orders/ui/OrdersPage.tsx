import { NativeSelect, Stack } from "@mantine/core";
import { useLayoutEffect, useReducer, useState } from "react";
import { AppSlots } from "../../../app";
import { OrderCard } from "../../../entities";
import { DEFAULT_PAGINATION_OPTIONS } from "../../../shared";
import { PaginationSelector, SuspendedList } from "../../../widgets";
import { OrdersPageParams, useOrders } from "../model";

const mapper = (order) => {
  return <OrderCard {...order} key={"order-" + order.id}/>;
};

const findIncludes = (forItem, allItems) => {
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
    return filteredOrders;
  };
};

export const OrdersPage = () => {
  const pageParams = new OrdersPageParams();
  const [settings, dispatch] = useReducer(pageParams.reducer, pageParams);
  const { data, isLoading, error, allItems, isAllItemsLoading, allItemsError } = useOrders(settings);
  const [isCustomLoading, setIsCustomLoading] = useState(true);

  const handleSortChange = (event) => {
    dispatch({ type: "sortLabel", value: event });
  };
  const handleStatusChanged = (event) => {
    dispatch({ type: "statusLabel", value: event });
  };

  useLayoutEffect(() => {
    if (
      !settings.forItem
       && !isLoading
       && !error
       && data
    ) {
      dispatch({ type: "pagesCount", value: data.pages });
      dispatch({ type: "initialPagesCount", value: data.pages });
    } else
      if (
        !isAllItemsLoading
        && !allItemsError
        && allItems
      ) {
        setIsCustomLoading(() => true);
        dispatch({
          type: "forItem",
          value: {
            doneSignal: () => setIsCustomLoading(() => false),
            filterFunction: findIncludes(
              settings.forItem,
              allItems,
            ),
          } });
      }
  }, [
    data,
    allItems,
  ]);

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
            ? settings.filteredItems.getSliceForCurrentPage(settings)
            : data?.data
        }
      />

    </Stack>
  </AppSlots>;
};
