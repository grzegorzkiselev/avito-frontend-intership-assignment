import { Button, Center, Loader, Modal, NativeSelect, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useReducer } from "react";
import { AppSlots } from "../../../app";
import { Advertisement, AdvertisementCard, CreateUpdateAdvertisementCard } from "../../../entities";
import { ADVERTISEMENTS_PROPS, CenteredLoader, DEFAULT_PAGINATION_OPTIONS, ErrorMessage, getMinMaxValues } from "../../../shared";
import { Pagination, PaginationSelector, Range, RangeSelector, Search } from "../../../widgets";
import { filterableFields, filterFields, initialSettings, reducer, sortConfig, updateMinMaxValues, useAdvertisements } from "../model";

const advertisementMapper = (advertisement: Advertisement) => <AdvertisementCard {...advertisement} key={advertisement.id} />;

export const AdvertisementsPage = () => {
  const [settings, dispatch] = useReducer(reducer, initialSettings);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  const conditionalRenderer = (isLoading, items, error) => {
      return isLoading
        ? <CenteredLoader />
        : error
          ? <ErrorMessage>{ JSON.stringify(error, null, 2) }</ErrorMessage>
          : !items || items?.length === 0
            ? <Center style={{ "flexGrow": "1" }}><Text>Ничего не найдено, попробуйте изменить фильтр</Text></Center>
            : <>
              {items.map(advertisementMapper)}
              <Pagination page={settings.page} pagesCount={settings.pagesCount} dispatch={dispatch} />
            </>
  }

  filterableFields.forEach((field) => {
    const value = settings[field + "Range"] as Range;
    const { minValueItem, maxValueItem, isMinMaxValuesLoading, minMaxValueError } = getMinMaxValues(ADVERTISEMENTS_PROPS.endpoint, field);
    value.isLoading = isMinMaxValuesLoading;
    value.error = minMaxValueError;
    updateMinMaxValues(isMinMaxValuesLoading, minMaxValueError, { minValueItem, maxValueItem, field, rangeLink: value });
  });

  const { data, allItems, isLoading, isAllItemsLoading, error, allItemsError } = useAdvertisements(settings);
  useEffect(() => {
    if (!isLoading && !error && data) {
      dispatch({ type: "pagesCount", value: data.pages });
    }
  }, [data, isLoading]);

  /** @todo reuse this logic */
  useEffect(() => {
    if (!isLoading && !error && data) {
      let pagesCount = data.pages;

      if (
        settings.query
        && settings.query.length > 2
        && !isAllItemsLoading
        && !allItemsError
      ) {
        const searchReg = new RegExp(settings.query, "i");
        const filteredAdvertisements = allItems.filter((advertisement) => {
          return advertisement.name.toLowerCase().match(searchReg);
        });
        pagesCount = Math.ceil(filteredAdvertisements.length / settings.paginationSize);
        dispatch({ type: "filteredAdvertisements", value: filteredAdvertisements })

        if (settings.page > pagesCount) {
          dispatch({ type: "page", value: pagesCount })
        }
      } else {
        settings.filteredAdvertisements = null;
      }

      dispatch({ type: "pagesCount", value: pagesCount });
    }
  }, [data, allItems, isLoading, isAllItemsLoading, settings.query]);

  useEffect(() => {
    console.log("qch")
  }, [settings.query])

  const first = (settings.page - 1) * settings.paginationSize;
  const last = first + settings.paginationSize;
  console.log("bothered", first, last, settings.filteredAdvertisements)

  return <AppSlots
    adaptiveSidebar={
      <Stack>
        <PaginationSelector paginationOptions={DEFAULT_PAGINATION_OPTIONS} value={settings.paginationSize} dispatch={dispatch}/>
        {
          filterFields.map((field) => {
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
      <Search suggestions={settings.searchHistory} type="query" value={settings.query} dispatch={dispatch} />
      <>
        { settings.query ? conditionalRenderer(isLoading, settings?.filteredAdvertisements?.slice(first, last), error) : conditionalRenderer(isLoading, data?.data, error) }
      </>
    </Stack>

  </AppSlots>;
};
