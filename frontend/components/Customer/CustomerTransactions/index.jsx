import Customerlayout from "../../Layout/Customerlayout";
import NewTransaction from "../../Shared/NewTransaction";
import TransactionTable from "../../Shared/TransactionTable";

const CustomerTransactions = () => {
  // Get UserInfo From SessionStorage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  return (
    <Customerlayout>
      <NewTransaction />
      <TransactionTable
        query={{
          accountNo: userInfo?.accountNo,
          branch: userInfo?.branch,
        }}
      />
    </Customerlayout>
  );
};

export default CustomerTransactions;
