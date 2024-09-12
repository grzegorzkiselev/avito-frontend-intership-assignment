import { Alert, Center, NativeSelect, Stack, Text } from "@mantine/core";
import { useEffect, useReducer } from "react";
import { AppSlots } from "../../../app";
import { OrderStatus } from "../../../entities";
import { OrderCard } from "../../../entities/order/ui";
import { CenteredLoader, DEFAULT_PAGINATION_SIZE } from "../../../shared";
import { Pagination, PaginationSelector } from "../../../widgets";
import { useOrders } from "../model";

const defaultStatusLabel = "All";
const statusSelectConfig = [defaultStatusLabel, ...Object.keys(OrderStatus)];

const sortConfig = {
  "Сначала c меньшей суммой": {
    by : "total",
    direction : "asc",
  },
  "Сначала с большей суммой": {
    by : "total",
    direction : "desc",
  },
};

const currentUrl = new URL(window.location.href);
const initialSettings: {
  query: string,
  searchHistory: string[],
  page: number,
  paginationSize: number,
  itemsCount: number,
  pagesCount: number,
  priceRange: Range,
  likesRange: Range,
  viewsRange: Range,
  forItem: string,
  sortLabel: keyof typeof sortConfig,
  statusLabel: string,
  sort: {
    by: "views" | "likes" | "price",
    direction: "asc" | "desc"
  }
} = {
  page: Number(currentUrl.searchParams.get("page")) || 1,
  paginationSize: Number(currentUrl.searchParams.get("paginationSize")) || DEFAULT_PAGINATION_SIZE,
  pagesCount: 0,
  itemsCount: 0,
  forItem: Number(currentUrl.searchParams.get("forItem")),
  sortLabel: currentUrl.searchParams.get("sortLabel") || Object.keys(sortConfig)[0],
  sort: function() {
    return sortConfig[this.sortLabel];
  },
  statusLabel: currentUrl.searchParams.get("sortLabel") || statusSelectConfig[0],
  status: function() {
    return statusSelectConfig.indexOf(this.statusLabel) - 1;
  },
  filteredOrders: null,
};
initialSettings.sort = initialSettings.sort();
initialSettings.status = initialSettings.status();

const reducer = (settings, action) => {
  settings[action.type] = action.value;
  if (
    action.type === "sortLabel"
  ) {
    settings[action.type] = (Array.from(action.value.target.children).find((element) => element.selected)).value;
    currentUrl.searchParams.set(action.type, settings[action.type]);

    settings.sort = sortConfig[settings.sortLabel];

    settings.page = 1;
  }

  if (
    action.type === "statusLabel"
  ) {
    const selectedOptionIndex = Array.from(action.value.target.children).findIndex((element) => element.selected);
    settings[action.type] = statusSelectConfig[selectedOptionIndex];
    settings.status = selectedOptionIndex  - 1;
    currentUrl.searchParams.set(action.type, settings[action.type]);
    settings.sort = sortConfig[settings.sortLabel];
    settings.page = 1;
  }

  if (action.type === "page"
    || action.type === "paginationSize"
  ) {
    currentUrl.searchParams.set(action.type, "" + settings[action.type]);
  }

  window.history.pushState(null, "", currentUrl);

  return { ...settings };
};

export const OrdersPage = () => {
  const [settings, dispatch] = useReducer(reducer, initialSettings);
  const { data, isLoading, error } = useOrders(settings);
  useEffect(() => {
    if (!isLoading && !error) {
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
  }, [data, isLoading]);

  return <AppSlots
    adaptiveSidebar={
      <Stack>
        <PaginationSelector value={settings.paginationSize} dispatch={dispatch}/>
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

  // return <Grid className={isMobile ? classes.manitineGroupInnerOverride : ""} style={{ "display": "grid" }}>
  //   <Grid.Col mb="md" span="auto">
  //     <AppSidebar isMobile={isMobile}>
  //       {
  //         ((children) => {
  //           return isMobile
  //             ? <>
  //               <Drawer offset={8} radius="md" opened={opened} onClose={close} position="bottom" title="Фильтр">
  //                 {children}
  //               </Drawer>
  //               <Button variant="light" onClick={open}>Фильтр и сортировка</Button>
  //             </>
  //             : <Card

  //               withBorder radius="md" p="s">
  //               {children}
  //             </Card>;
  //         })()
  //       }
  //     </AppSidebar>
  //   </Grid.Col>
  //   <Grid.Col span={isMobile ? 12 : 8 } style={{ "display": "grid", "flexGrow": "1" }} >

  //   </Grid.Col>
  // </Grid>;
};

// ? <CenteredLoader />
// : error
//   ? <div>{ JSON.stringify(error, null 2) }</div>
//   : <>
//   { (settings.filteredOrders || data.data).length === 0
//     ? <Center style={{ "flexGrow": "1" }}><Text>Ничего не найдено, попробуйте изменить фильтр</Text></Center>
//     : <>{
//       (settings.filteredOrders || data.data).map((order) => {
//         return <OrderCard {...order} key={order.id}/>;
//       })
//     }
//     <Center><Pagination total={settings.pagesCount} value={settings.page} onChange={handlePaginationChange} /></Center>
//     </>
