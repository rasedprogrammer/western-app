import { Card, Input, Image, Form, Select, Button, message, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { http } from "../../../modules/modules";

const NewTransaction = () => {
  //   Get User Info From Session Storage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  // form Info
  const [transactionForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  //   State Collection
  const [accountNo, setAccountNo] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);

  //   On Finish Function
  const onFinish = (values) => {
    console.log(values);
  };

  //   Search Account Function
  const searchByAccountNo = async () => {
    try {
      const obj = {
        accountNo: Number(accountNo),
        branch: userInfo?.branch,
      };
      console.log(obj);

      const httpReq = http();
      const { data } = await httpReq.post(`/api/find-by-account`, obj);
      console.log(data);

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
          <Empty />
        )}
      </Card>
    </div>
  );
};

export default NewTransaction;
