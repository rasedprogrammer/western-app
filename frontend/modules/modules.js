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
  let finalObj = {};
  for (let key in obj) {
    const value = obj[key];
    if (typeof value === "string") {
      finalObj[key] = value?.trim();
    } else if (typeof value === "number" || typeof value === "boolean") {
      finalObj[key] = value.toString();
    } else {
      finalObj[key] = value;
    }
  }
  return finalObj;
};
// export const trimData = (obj) => {
//   const finalData = {};
//   for (let key in obj) {
//     finalData[key] = obj[key]?.trim();
//   }
//   return finalData;
// };

// Fetcher Function for SWR
export const fetchData = async (api) => {
  try {
    const httpReq = http();
    const { data } = await httpReq.get(api);
    return data;
  } catch (error) {
    return null;
  }
};

// Upload File Function
export const uploadFile = async (file, folderName) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folderName", folderName);

  try {
    const httpReq = http();
    const response = await httpReq.post(
      `/api/upload?folderName=${folderName}`,
      formData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
