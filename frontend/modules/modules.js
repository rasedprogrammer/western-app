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

// formate date
export const formatDate = (d) => {
  const date = new Date(d);
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let yy = date.getFullYear();
  let tt = date.toLocaleTimeString();
  dd = dd < 10 ? "0" + dd : dd;
  mm = mm < 10 ? "0" + mm : mm;
  return `${dd}-${mm}-${yy} ${tt}`;
};

// Print Function
export const printBankTransactions = (data) => {
  let html = `
    <html>
    <head>
      <title>Bank Transactions Details</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
      </style>
    </head>
    <body>
      <h2>Bank Transactions Details</h2>
      <table>
        <thead>
          <tr>
            <th>Account No</th>
            <th>Branch</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>`;

  data.forEach((txn) => {
    html += `
              <tr>
                <td>${txn.accountNo}</td>
                <td>${txn.branch}</td>
                <td>${txn.transactionType}</td>
                <td>${txn.transactionAmount}</td>
                <td>${formatDate(txn.createdAt)}</td>
              </tr>`;
  });

  html += `
        </tbody>
      </table>
    </body>
    </html>`;

  // Write content and print
  const newWin = window.open("", "_blank");
  newWin.document.write(html);
  newWin.print();
  newWin.document.close();
};
