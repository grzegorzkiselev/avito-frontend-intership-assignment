import { PageParams, SortConfig } from "../../../widgets";

const ranges = [
  {
    id: "priceRange",
    field: "price",
    title: "Диапазон цен",
    isLoading: true,
    error: null,
    minAvailable: 0,
    maxAvailable: Infinity,
    min: 0,
    max: Infinity,
  },
  {
    id: "viewsRange",
    field: "views",
    title: "Диапазон просмотров",
    isLoading: true,
    error: null,
    minAvailable: 0,
    maxAvailable: Infinity,
    min: 0,
    max: Infinity,
  },
  {
    id: "likesRange",
    field: "likes",
    title: "Диапазон лайков",
    isLoading: true,
    error: null,
    minAvailable: 0,
    maxAvailable: Infinity,
    min: 0,
    max: Infinity,
  },
];

export const sortConfig: SortConfig = {
  "Сначала дешевле": {
    by : "price",
    direction : "asc",
  },
  "Сначала дороже": {
    by : "price",
    direction : "desc",
  },
  "Сначала меньше лайков": {
    by : "likes",
    direction : "asc",
  },
  "Сначала больше лайков": {
    by : "likes",
    direction : "desc",
  },
  "Сначала меньше просмотров": {
    by : "views",
    direction : "asc",
  },
  "Сначала больше просмотров": {
    by : "views",
    direction : "desc",
  },
} as const;

export class AdvertisementsPageParams extends PageParams {
  constructor() {
    super();
    this.initRanges(ranges);
    this.initSort(sortConfig);

    this.query = this.currentUrl.searchParams.get("query") || "",
    this.searchHistory = (() => {
      try {
        return JSON.parse(localStorage.getItem("searchHistory") || "") || [];
      } catch(error) {
        return [];
      }
    })();
  }
}
