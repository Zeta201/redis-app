import axios from "axios";

const API = axios.create({ baseURL: "/api/" });

export const getValues = () => API.get("values/current");
export const geIndexes = () => API.get("values/all");
export const insertValue = (data) => API.post("values", data);
