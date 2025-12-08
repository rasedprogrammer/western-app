import {
  Card,
  Input,
  Image,
  Form,
  Select,
  Button,
  DatePicker,
  message,
  Empty,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { http, trimData } from "../../../modules/modules";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const NewTransaction = ({ query = {} }) => {
  const token = cookies.get("authToken");

  //   Get User Info From Session Storage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  // form Info
  const [transactionForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  //   State Collection
  const [accountNo, setAccountNo] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  //   On Finish Function
  const onFinish = async (values) => {
    try {
      const finalObj = trimData(values);
      let balance = 0;
      if (finalObj.transactionType === "cr") {
        balance =
          Number(accountDetails.finalBalance) +
          Number(finalObj.transactionAmount);
      } else if (finalObj.transactionType === "dr") {
        balance =
          Number(accountDetails.finalBalance) -
          Number(finalObj.transactionAmount);
      }

      finalObj.currentBalance = balance;
      finalObj.customerId = accountDetails._id;
      finalObj.accountNo = accountDetails.accountNo;
      finalObj.fullname = accountDetails.fullname;
      finalObj.branch = userInfo.branch;
      finalObj.issueDate = new Date(finalObj.issueDate);
      finalObj.flightDate = new Date(finalObj.flightDate);

      console.log(finalObj);

      const httpReq = http(token);
      await httpReq.post(`/api/transaction`, finalObj);
      await httpReq.put(`/api/customers/${accountDetails._id}`, {
        finalBalance: balance,
      });
      messageApi.success("Transaction Create Successfully!!");
      transactionForm.resetFields();
      setAccountDetails(null);
      setReloadKey((k) => k + 1);
    } catch (error) {
      messageApi.error(
        error.response
          ? error.response.data.message
          : "Unable to process transaction!!!"
      );
    }
  };

  //   Search Account Function
  const searchByAccountNo = async () => {
    try {
      const obj = {
        accountNo: Number(accountNo),
        branch: userInfo?.branch,
      };

      const httpReq = http(token);
      const { data } = await httpReq.post(`/api/find-by-account`, obj);

      if (data?.data) {
        setAccountDetails(data?.data);
      } else {
        messageApi.warning("There is no record of this account no!");
        setAccountDetails(null);
      }
    } catch (error) {
      messageApi.error("Unable to find account details!");
    }
  };

  return (
    <div>
      {contextHolder}
      <Card
        title="New Transaction"
        extra={
          !query.isCustomer && (
            <Input
              onChange={(e) => {
                setAccountNo(e.target.value);
              }}
              placeholder="Enter Account Number"
              addonAfter={
                <SearchOutlined
                  onClick={searchByAccountNo}
                  style={{ cursor: "pointer" }}
                />
              }
            />
          )
        }
      >
        {accountDetails ? (
          <div>
            {/* 1st Div */}
            <div className="flex items-center justify-start gap-2">
              <Image
                src={`${import.meta.env.VITE_BASEURL}/${
                  accountDetails?.profile
                }`}
                width={120}
                className="rounded-full"
              />
              <Image
                src={`${import.meta.env.VITE_BASEURL}/${
                  accountDetails?.signature
                }`}
                width={120}
                className="rounded-full"
              />
            </div>
            {/* 2nd Div */}
            <div className="mt-5 grid md:grid-cols-3 gap-8">
              <div className="mt-3 flex flex-col gap-3">
                {/*  */}
                <div className="flex items-center justify-between">
                  <b>Name: </b> <b>{accountDetails?.fullname}</b>
                </div>
                {/*  */}
                <div className="flex items-center justify-between">
                  <b>Mobile: </b> <b>{accountDetails?.mobile}</b>
                </div>
                {/*  */}
                <div className="flex items-center justify-between">
                  <b>Balance: </b>{" "}
                  <b>
                    {accountDetails?.finalBalance}
                    {accountDetails?.currency === "bdt" ? " tk." : " $"}
                  </b>
                </div>
                {/*  */}
                <div className="flex items-center justify-between">
                  <b>DOB: </b> <b>{accountDetails?.dob}</b>
                </div>
                {/*  */}
                <div className="flex items-center justify-between">
                  <b>Currency: </b> <b>{accountDetails?.currency}</b>
                </div>
              </div>
              <div></div>
              <Form
                form={transactionForm}
                onFinish={onFinish}
                layout="vertical"
              >
                {/* Pax Name */}
                <Form.Item
                  label="Particular Name"
                  name="paxName"
                  rules={[{ required: true, message: "Please enter pax name" }]}
                >
                  <Input placeholder="Passenger Name" />
                </Form.Item>

                {/* Pax Number */}
                <Form.Item label="Pax Number" name="paxNumber">
                  <Input placeholder="Passenger Number" />
                </Form.Item>
                <div className="grid md:grid-cols-2 gap-x-3">
                  {/* Issue Date */}
                  <Form.Item
                    label="Issue Date"
                    name="issueDate"
                    rules={[
                      { required: true, message: "Please select issue date" },
                    ]}
                  >
                    <DatePicker className="w-full" />
                  </Form.Item>

                  {/* Flight Date */}
                  <Form.Item label="Flight Date" name="flightDate">
                    <DatePicker className="w-full" />
                  </Form.Item>
                </div>
                {/* Sector */}
                <Form.Item label="Sector" name="sector">
                  <Input placeholder="DAC-KUL" />
                </Form.Item>

                <div className="grid md:grid-cols-2 gap-x-3">
                  {/* Airline */}
                  <Form.Item label="Airline" name="airline">
                    <Input placeholder="Emirates / Biman / Qatar" />
                  </Form.Item>

                  {/* PNR */}
                  <Form.Item label="PNR" name="pnr">
                    <Input placeholder="PNR / Booking Code" />
                  </Form.Item>
                </div>
                <div className="grid md:grid-cols-2 gap-x-3">
                  {/* Transaction Type */}
                  <Form.Item
                    label="Transaction Type"
                    rules={[{ required: true }]}
                    name="transactionType"
                  >
                    <Select
                      placeholder="Transaction Type"
                      className="w-full"
                      options={[
                        { value: "cr", label: "CR" },
                        { value: "dr", label: "DR" },
                      ]}
                    />
                  </Form.Item>
                  {/* Transaction Amount */}
                  <Form.Item
                    label="Transaction Amount"
                    rules={[{ required: true }]}
                    name="transactionAmount"
                  >
                    <Input placeholder="500.00" type="number" />
                  </Form.Item>
                </div>
                {/* Reference */}
                <Form.Item label="Reference" name="reference">
                  <Input.TextArea />
                </Form.Item>
                {/* Sector */}
                <Form.Item label="Sell Or Buy" name="sellOrBuy">
                  <Input placeholder="Sell or Buy Customer or Vendor!!!" />
                </Form.Item>
                {/* Submit Button */}
                <Form.Item>
                  <Button
                    type="text"
                    htmlType="submit"
                    className="!text-white !bg-blue-500 !font-semibold !w-full"
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </Card>
    </div>
  );
};

export default NewTransaction;
