import axios from "axios";
// HTTP Request Middleware
export const http = (accessToken = null) => {
  axios.defaults.baseURL = import.meta.env.VITE_BASEURL;
  if (accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }
  return axios;
};

// Trim Data Function
export const trimData = (obj) => {
  const finalData = {};
  for (let key in obj) {
    finalData[key] = obj[key]?.trim();
  }
  return finalData;
};
