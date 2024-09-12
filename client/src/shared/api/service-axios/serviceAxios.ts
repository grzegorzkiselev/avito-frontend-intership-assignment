import axios, { type AxiosStatic } from "axios";
import { API_BASE_URL } from "../../config";

export const getServiceAxios = (() => {
  const serviceAxios: AxiosStatic = null as never;

  return () => serviceAxios
  || axios.create({ baseURL: API_BASE_URL });
})();
