export const filterableFields = ["price", "views", "likes"] as const;
const ranges = [
  {
    title: "Диапазон цен",
    for: "price",
    isLoading: true,
    error: null,
    minAvailable: 0,
    maxAvailable: Infinity,
    min: Number(currentUrl.searchParams.get("min-priceRange")) || 0,
    max: Number(currentUrl.searchParams.get("max-priceRange")) || Infinity,
  },
  {
    title: "Диапазон просмотров",
    for: "views",
    isLoading: true,
    error: null,
    minAvailable: 0,
    maxAvailable: Infinity,
    min: Number(currentUrl.searchParams.get("min-viewsRange")) || 0,
    max: Number(currentUrl.searchParams.get("max-viewsRange")) || Infinity,
  },
  {
    title: "Диапазон лайков",
    for: "likes",
    isLoading: true,
    error: null,
    minAvailable: 0,
    maxAvailable: Infinity,
    min: Number(currentUrl.searchParams.get("min-likesRange")) || 0,
    max: Number(currentUrl.searchParams.get("max-likesRange")) || Infinity,
  },
];


export const sortConfig = {
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

export class AdvertisementsPageParms extends PageParams {
  constructor() {
    super();

  }
}

export const initialSettings = (() => {
  let pageParams = null;
  return () => pageParams || (pageParams = new AdvertisementsPageParms());
})();
