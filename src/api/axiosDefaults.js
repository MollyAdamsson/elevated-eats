import axios from "axios";

// axios.defaults.baseURL = "https://8000-mollyadamsso-apirecipes-xig7hcg001o.ws-eu95.gitpod.io";
axios.defaults.baseURL = "https://ee-api.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
