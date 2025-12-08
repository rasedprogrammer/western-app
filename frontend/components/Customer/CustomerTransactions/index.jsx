import Customerlayout from "../../Layout/Customerlayout";
import NewTransaction from "../../Shared/NewTransaction";
import TransactionTable from "../../Shared/TransactionTable";

const CustomerTransactions = () => {
  // Get UserInfo From SessionStorage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  return (
    <Customerlayout>
      <NewTransaction
        query={{
          isCustomer: true,
        }}
      />
      <TransactionTable
        query={{
          accountNo: userInfo?.accountNo,
          branch: userInfo?.branch,
          fullname: userInfo?.fullname,
          isCustomer: true,
        }}
      />
    </Customerlayout>
  );
};

export default CustomerTransactions;
