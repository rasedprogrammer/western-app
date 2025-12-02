import Adminlayout from "../Layout/Adminlayout";
import Dashboard from "../Shared/Dashboard";
import useSWR from "swr";
import { fetchData } from "../../modules/modules";

const AdminDashboard = () => {
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  console.log(userInfo);

  const { data: trData, error: trError } = useSWR(
    `/api/transaction/summary?branch=${userInfo.branch}`,
    fetchData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 12000000,
    }
  );
  console.log(trData);

  return (
    <Adminlayout>
      <Dashboard />
    </Adminlayout>
  );
};

export default AdminDashboard;
