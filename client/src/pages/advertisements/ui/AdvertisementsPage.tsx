import { Button, Center, Loader, Modal, NativeSelect, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useLayoutEffect, useReducer } from "react";
import { AppSlots } from "../../../app";
import { Advertisement, AdvertisementCard, CreateUpdateAdvertisementCard } from "../../../entities";
import { DEFAULT_PAGINATION_OPTIONS, ErrorMessage } from "../../../shared";
import { MinMaxSelector, PaginationSelector, Search, SuspendedList } from "../../../widgets";
import { AdvertisementsPageParams, useAdvertisements } from "../model";

const advertisementMapper = (advertisement: Advertisement) => <AdvertisementCard {...advertisement} key={advertisement.id} />;
const buildSearchFunction = (query: string, collection: Advertisement[]) => {
  return () => {
    const searchReg = new RegExp(query, "i");
    return collection.filter((item) => {
      return item.name.toLowerCase().match(searchReg);
    });
  };
};

export const AdvertisementsPage = () => {
  const pageParams = new AdvertisementsPageParams();
  const [settings, dispatch] = useReducer(pageParams.reducer, pageParams);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  /** I use uncontrolled components for ranges and query
    * and when I drop values, they stays the same
    * need to figure out, how to deal with it.
    * First idea — useRef, we can initialize useRef for each range.
    * But want we?
    */
  // const reset = () => {
  //   dispatch({ type: "resetRanges" });
  //   dispatch({ type: "resetSort" });
  //   dispatch({ type: "resetQuery" });
  //   dispatch({ type: "reset" });
  // };

  const { data, allItems, isLoading, isAllItemsLoading, error, allItemsError } = useAdvertisements(settings);
  const handleSearchChange = (event: string) => {
    if (
      !isAllItemsLoading && !allItemsError && allItems
    ) {
      const actionValue = {
        query: event,
        filterFunction: buildSearchFunction(event, allItems),
      };

      dispatch({ type: "query", value: actionValue });
    }
  };

  useLayoutEffect(() => {
    if (
      data
       && !settings.query
    ) {
      dispatch({ type: "pagesCount", value: data.pages });
      dispatch({ type: "initialPagesCount", value: data.pages });
    } else if (allItems) {
      handleSearchChange(settings.query);
    }
  }, [
    data,
    allItems,
    isLoading,
    isAllItemsLoading,
    error,
    allItemsError,
    settings.query,
  ]);

  return <AppSlots
    adaptiveSidebar={
      <Stack>
        <PaginationSelector paginationOptions={DEFAULT_PAGINATION_OPTIONS} value={settings.paginationSize} dispatch={dispatch}/>
        {
          settings.ranges.map((range) => {
            return range.isLoading
              ? <Center key={range.id + "-id-loader"}><Loader /></Center>
              : range.error
                ? <ErrorMessage key={range.id + "-id-error"}>{ JSON.stringify(range.error, null, 2) }</ErrorMessage>
                : range.max
                  ? <MinMaxSelector dispatch={dispatch} range={{ ...range }}>{range.title}</MinMaxSelector>
                  : <ErrorMessage key={range.id + "-id-not-max"}>Не удалось загрузить данные</ErrorMessage>;
            {/*<RangeSelector key={range.id + "-id-selector"} range={{ ...range }} dispatch={dispatch}>{range.title}</RangeSelector>*/}
          })
        }
        <NativeSelect
          value={settings.sortLabel}
          onChange={(event) => dispatch({ type: "sortLabel", value: event })}
          label="Сортировать"
          data={Object.keys(settings.sortConfig)}
        />
      </Stack>
    }
    sidebar={
      <>
        <Modal opened={modalOpened} onClose={closeModal}>
          <CreateUpdateAdvertisementCard close={closeModal} />
        </Modal>

        {/* <Button onClick={reset}>Сбросить фильтр</Button> */}

        <Button onClick={openModal}>Создать объявление</Button>
      </>
    }
  >
    <Stack>
      <Search
        suggestions={settings.searchHistory}
        value={settings.query}
        onSearchChange={handleSearchChange}
      />
      <SuspendedList
        settings={settings}
        dispatch={dispatch}
        mapper={advertisementMapper}
        isLoading={
          isLoading
          || isAllItemsLoading
        }
        error={error}
        items={
          settings.query
            ? settings?.filteredItems?.getSliceForCurrentPage(settings)
            : data?.data
        }
      />
    </Stack>
  </AppSlots>;
};
