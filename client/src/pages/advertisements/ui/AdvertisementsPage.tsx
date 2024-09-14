import { Button, Center, Loader, Modal, NativeSelect, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useLayoutEffect, useReducer } from "react";
import { AppSlots } from "../../../app";
import { Advertisement, AdvertisementCard, CreateUpdateAdvertisementCard } from "../../../entities";
import { ADVERTISEMENTS_PROPS, DEFAULT_PAGINATION_OPTIONS, ErrorMessage, getMinMaxValues } from "../../../shared";
import { PaginationSelector, Range, RangeSelector, Search, SuspendedList } from "../../../widgets";
import { filterableFields, initialSettings, reducer, sortConfig, updateMinMaxValues, useAdvertisements } from "../model";

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
  const [settings, dispatch] = useReducer(reducer, initialSettings);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  /** @todo move method into reducer */
  filterableFields.forEach((field) => {
    const value = settings[field + "Range"] as Range;
    const { minValueItem, maxValueItem, isMinMaxValuesLoading, minMaxValueError } = getMinMaxValues(ADVERTISEMENTS_PROPS.endpoint, field);
    value.isLoading = isMinMaxValuesLoading;
    value.error = minMaxValueError;
    updateMinMaxValues(isMinMaxValuesLoading, minMaxValueError, { minValueItem, maxValueItem, field, rangeLink: value });
  });

  const { data, allItems, isLoading, isAllItemsLoading, error, allItemsError } = useAdvertisements(settings);
  useLayoutEffect(() => {
    if (!isLoading && !error && data) {
      dispatch({ type: "pagesCount", value: data.pages });
      dispatch({ type: "initialPagesCount", value: data.pages });
    }
  }, [data, isLoading, error]);

  const handleSearchChange = (event) => {
    if (
      !isAllItemsLoading && !allItemsError
    ) {
      dispatch({
        type: "query",
        value: {
          query: event,
          filterFunction: buildSearchFunction(event, allItems),
        },
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
          filterableFields.map((field) => {
            const rangeName = field + "Range";
            const rangeLink = settings[field + "Range"];

            return settings[rangeName].isLoading
              ? <Center key={rangeName + "-id-loader"}><Loader /></Center>
              : rangeLink.error
                ? <ErrorMessage key={rangeName + "-id-error"}>{ JSON.stringify(rangeLink.error, null, 2) }</ErrorMessage>
                : rangeLink.max
                  ? <RangeSelector field={field} key={rangeName + "-id-selector"} settings={rangeLink} dispatch={dispatch} type={rangeName}>{rangeLink.title}</RangeSelector>
                  : <ErrorMessage key={rangeName + "-id-not-max"}>Не удалось загрузить данные</ErrorMessage>;
          })
        }
        <NativeSelect value={settings.sortLabel} onChange={(event) => dispatch({ type: "sortLabel", value: event })} label="Сортировать" data={Object.getOwnPropertyNames(sortConfig)} />
      </Stack>
    }
    sidebar={
      <>
        <Modal opened={modalOpened} onClose={closeModal}>
          <CreateUpdateAdvertisementCard close={closeModal} />
        </Modal>

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
          || settings?.filteredItems.length > 0
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
