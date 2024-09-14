import { Button, Center, Loader, Modal, NativeSelect, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useLayoutEffect, useReducer } from "react";
import { AppSlots } from "../../../app";
import { Advertisement, AdvertisementCard, CreateUpdateAdvertisementCard } from "../../../entities";
import { DEFAULT_PAGINATION_OPTIONS, ErrorMessage } from "../../../shared";
import { PaginationSelector, RangeSelector, Search, SuspendedList } from "../../../widgets";
import { AdvertisementsPageParams, useAdvertisements } from "../model";

const advertisementMapper = (advertisement: Advertisement) => <AdvertisementCard {...advertisement} key={advertisement.id} />;
const buildSearchFunction = (query, collection) => {
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

  useEffect(() => {
    settings.query = settings.query;
  }, [settings.query]);

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  const { data, allItems, isLoading, isAllItemsLoading, error, allItemsError } = useAdvertisements(settings);
  useLayoutEffect(() => {
    if (
      !isLoading
      && !error
      && data
    ) {
      dispatch({ type: "pagesCount", value: data.pages });
      dispatch({ type: "initialPagesCount", value: data.pages });
    }
  }, [data, isLoading, error]);

  const handleSearchChange = (event: string) => {
    const actionValue = {
      query: event,
      filterFunction: buildSearchFunction(event, allItems),
    };

    if (
      !isAllItemsLoading && !allItemsError
    ) {
      dispatch({
        type: "query",
        value: actionValue,
      });
    }
  };

  useLayoutEffect(() => {
    if (!isAllItemsLoading && !allItemsError && allItems) {
      handleSearchChange(settings.query);
    }
  }, [isAllItemsLoading, allItemsError, allItems]);

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
                  ? <RangeSelector key={range.id + "-id-selector"} settings={{ ...range }} dispatch={dispatch}>{range.title}</RangeSelector>
                  : <ErrorMessage key={range.id + "-id-not-max"}>Не удалось загрузить данные</ErrorMessage>;
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
        type="query"
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
            ? settings?.filteredItems?.getSliceForCurrentPage()
            : data?.data
        }
      />
    </Stack>
  </AppSlots>;
};
