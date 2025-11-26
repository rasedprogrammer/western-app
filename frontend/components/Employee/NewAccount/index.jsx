import { Button, Card, DatePicker, Form, Modal, Select, Table } from "antd";
import Empployeelayout from "../../Layout/Employeelayout";
import Input from "antd/es/input/Input";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
const { Item } = Form;

const NewAccount = () => {
  // State Collection
  const [accountForm, setAccountForm] = Form.useForm();
  const [accountModal, setAccountModal] = useState(false);
  // Columns for Table
  const columns = [
    // Branch
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
    },
    // User Type
    {
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
      render: (text) => {
        if (text === "admin") {
          return <span className="capitalize text-teal-600">{text}</span>;
        } else if (text === "employee") {
          return <span className="capitalize text-red-700">{text}</span>;
        } else {
          return <span className="capitalize text-indigo-800">{text}</span>;
        }
      },
    },
    // Account No
    {
      title: "Account No",
      dataIndex: "accountNo",
      key: "accountNo",
    },
    // Fullname
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
    },
    // DOB
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
    },
    // Email
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    // Mobile
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    // Address
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    // Photo
    {
      title: "Photo",
      key: "photo",
      render: (src, obj) => (
        <Image
          src={`${import.meta.env.VITE_BASEURL}/${obj.profile}`}
          className="rounded-full"
          width={40}
          height={40}
        />
      ),
    },
    // Signature
    {
      title: "Signature",
      key: "signature",
      render: (src, obj) => (
        <Image
          src={`${import.meta.env.VITE_BASEURL}/${obj.profile}`}
          className="rounded-full"
          width={40}
          height={40}
        />
      ),
    },
    // Document
    {
      title: "Document",
      key: "document",
      render: (src, obj) => (
        <Image
          src={`${import.meta.env.VITE_BASEURL}/${obj.profile}`}
          className="rounded-full"
          width={40}
          height={40}
        />
      ),
    },
    // Action
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, obj) => (
        <div className="flex gap-1">
          <Popconfirm
            title="Are you sure?"
            description="Once you update, you can also re-update it!"
            onCancel={() => messageApi.info("No changes occur !")}
            onConfirm={() => updateIsActive(obj._id, obj.isActive)}
          >
            <Button
              type="text"
              className={`${
                obj.isActive
                  ? "!text-indigo-500 !bg-indigo-100"
                  : "!text-pink-500 !bg-pink-100"
              }`}
              icon={obj.isActive ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            />
          </Popconfirm>
          <Popconfirm
            title="Are you sure !"
            description="Onec you update, you can re-update it!"
            onCancel={() => messageApi.info("No changes occur !")}
            onConfirm={() => onEditUser(obj)}
          >
            <Button
              type="text"
              className="!text-green-500 !bg-green-100"
              icon={<EditOutlined />}
            />
          </Popconfirm>
          <Popconfirm
            title="Are you sure ?"
            description="Once you delete, you can not re-store it!"
            onCancel={() => messageApi.info("Your data is safe!")}
            onConfirm={() => onDeleteUser(obj._id)}
          >
            <Button
              type="text"
              className="!text-rose-500 !bg-rose-100"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  //   On Finish Handler
  const onFinish = (values) => {
    console.log(values);
  };

  //   Search Handler
  const onSearch = () => {};

  return (
    <Empployeelayout>
      {/* Card Section Start */}
      <div className="grid">
        <Card
          title="Account List"
          style={{ overflowX: "auto" }}
          extra={
            <div className="flex gap-x-3">
              <Input
                placeholder="Search by all"
                prefix={<SearchOutlined />}
                onChange={onSearch}
              />
              <Button
                onClick={() => setAccountModal(true)}
                type="text"
                className="!font-bold !text-white !bg-blue-500"
              >
                Add New Account
              </Button>
            </div>
          }
        >
          <Table
            columns={columns}
            dataSource={[]}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </div>
      {/* Card Section End */}
      {/* Model Section Start */}
      <Modal
        open={accountModal}
        onCancel={() => setAccountModal(false)}
        width={820}
        footer={null}
        title={"Open New Account"}
      >
        <Form layout="vertical" onFinish={onFinish} form={accountForm}>
          <div className="grid md:grid-cols-3 gap-x-3">
            {/* Account No Input */}
            <Item
              label="Account No"
              name="accountNo"
              rules={[{ required: true, message: "Account No is required!" }]}
            >
              <Input placeholder="Account No" />
            </Item>
            {/* Fullname Input */}
            <Item
              label="Fullname"
              name="fullname"
              rules={[{ required: true, message: "Fullname is required!" }]}
            >
              <Input placeholder="Fullname" />
            </Item>
            {/* Mobile Input */}
            <Item
              label="Mobile"
              name="mobile"
              rules={[{ required: true, message: "Mobile is required!" }]}
            >
              <Input placeholder="Mobile" />
            </Item>
            {/* Father Name Input */}
            <Item
              label="Father Name"
              name="fatherName"
              rules={[{ required: true, message: "Father Name is required!" }]}
            >
              <Input placeholder="Father Name" />
            </Item>
            {/* Email Input */}
            <Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Email is required!" }]}
            >
              <Input placeholder="Email" />
            </Item>
            {/* Password Input */}
            <Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password is required!" }]}
            >
              <Input placeholder="Password" />
            </Item>
            {/* Father Name Input */}
            <Item
              label="DOB"
              name="dob"
              rules={[{ required: true, message: "DOB is required!" }]}
            >
              <DatePicker className="w-full" />
            </Item>
            {/* Gender Input */}
            <Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Gender is required!" }]}
            >
              <Select
                placeholder="Select Gender"
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "male" },
                  { label: "Other", value: "other" },
                ]}
              />
            </Item>
            {/* Currency Input */}
            <Item
              label="Currency"
              name="currency"
              rules={[{ required: true, message: "Currency is required!" }]}
            >
              <Select
                placeholder="Select Currency"
                options={[
                  { label: "BDT", value: "bdt" },
                  { label: "USD", value: "usd" },
                  { label: "INR", value: "inr" },
                ]}
              />
            </Item>
            {/* Photo Input */}
            <Item
              label="Photo"
              name="photo"
              rules={[{ required: true, message: "Photo is required!" }]}
            >
              <Input type="file" />
            </Item>
            {/* Signature Input */}
            <Item
              label="Signature"
              name="signature"
              rules={[{ required: true, message: "Signature is required!" }]}
            >
              <Input type="file" />
            </Item>
            {/* Document Input */}
            <Item
              label="Document"
              name="document"
              rules={[{ required: true, message: "Document is required!" }]}
            >
              <Input type="file" />
            </Item>
          </div>
          {/* Address Input */}
          <Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Address is required!" }]}
          >
            <Input.TextArea />
          </Item>
          {/* Submit Button */}
          <Item className="flex justify-end mb-0 mt-3 items-center">
            <Button
              type="text"
              htmlType="submit"
              className="!text-white !bg-blue-500  !font-bold"
            >
              Submit
            </Button>
          </Item>
        </Form>
      </Modal>
      {/* Model Section End */}
    </Empployeelayout>
  );
};

export default NewAccount;
