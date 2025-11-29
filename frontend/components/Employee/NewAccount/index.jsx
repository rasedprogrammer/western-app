import {
  Button,
  Card,
  Form,
  Image,
  Popconfirm,
  message,
  Modal,
  Select,
  Table,
} from "antd";
import Empployeelayout from "../../Layout/Employeelayout";
import Input from "antd/es/input/Input";
import {
  SearchOutlined,
  EyeInvisibleOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import {
  http,
  trimData,
  fetchData,
  uploadFile,
} from "../../../modules/modules";
import useSWR, { mutate } from "swr";

const { Item } = Form;

const NewAccount = () => {
  // Get User Info From SessionStorage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  // State Collection
  const [accountForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();
  // State collections
  const [accountModal, setAccountModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [document, setDocuments] = useState(null);
  const [signature, setSignature] = useState(null);
  const [allCustomer, setAllCustomer] = useState(null);
  const [finalCustomer, setFinalCustomer] = useState(null);
  const [no, setNo] = useState(0);
  const [edit, setEdit] = useState(null);

  // Get All Customer Data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/customers");

        setAllCustomer(data?.data);
        setFinalCustomer(data?.data);
      } catch (error) {
        messageApi.error("Unable To Fetch Customer Data");
      }
    };
    fetcher();
  }, [no]);

  // Get Branching Details
  const { data: brandings, error: bError } = useSWR(
    `/api/branding`,
    fetchData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 1200000,
    }
  );

  // Bank Account Get
  let bankAccountNo =
    Number(brandings && brandings?.data[0]?.bankAccountNo) + 1;
  let brandingingId = brandings && brandings?.data[0]?._id;
  // Set Account No
  accountForm.setFieldValue("accountNo", bankAccountNo);

  // Create New Account
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      finalObj.profile = photo ? photo : "bankImages/dummy.png";
      finalObj.signature = signature ? signature : "bankImages/dummy.png";
      finalObj.document = document ? document : "bankImages/dummy.png";
      finalObj.key = finalObj.email;
      finalObj.userType = "customer";
      finalObj.branch = userInfo?.branch;
      finalObj.createBy = userInfo?.email;
      const httpReq = http();
      await httpReq.post(`/api/users`, finalObj);
      const obj = {
        email: finalObj.email,
        password: finalObj.password,
      };
      await httpReq.post(`/api/customers`, finalObj);
      await httpReq.post(`/api/send-email`, obj);
      await httpReq.put(`/api/branding/${brandingingId}`, { bankAccountNo });

      accountForm.resetFields();
      mutate(`/api/branding`);
      setPhoto(null);
      setSignature(null);
      setDocuments(null);
      setNo(no + 1);
      setAccountModal(false);
      messageApi.success("Customer Created Successfully!");
    } catch (error) {
      if (error?.response?.data?.error?.code === 11000) {
        accountForm.setFields([
          {
            name: "email",
            errors: ["Email Already Exists!"],
          },
        ]);
      } else {
        messageApi.error("Try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Photo Upload
  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    const folderName = "customerPhoto";
    try {
      const result = await uploadFile(file, folderName);
      setPhoto(result.filePath);
    } catch (error) {
      messageApi.error("Customer Photo Upload Failed !");
    }
  };

  // Handle Signature Upload
  const handleSignature = async (e) => {
    const file = e.target.files[0];
    const folderName = "customerSignature";
    try {
      const result = await uploadFile(file, folderName);
      setSignature(result.filePath);
    } catch (error) {
      messageApi.error("Signature Photo Upload Failed !");
    }
  };

  // Handle Document Upload
  const handleDocument = async (e) => {
    const file = e.target.files[0];
    const folderName = "customerDocument";
    try {
      const result = await uploadFile(file, folderName);
      setDocuments(result.filePath);
    } catch (error) {
      messageApi.error("Document Photo Upload Failed !");
    }
  };

  // Update is Active
  const updateIsActive = async (id, isActive) => {
    try {
      const obj = {
        isActive: !isActive,
      };
      const httpReq = http();
      await httpReq.put(`/api/customers/${id}`, obj);

      messageApi.success("Record updated successfully !");
      setNo(no + 1);
    } catch (error) {
      messageApi.error("Unable to update isActive!");
    }
  };

  // Update Customer
  const onEditCustomer = async (obj) => {
    setEdit(obj);
    setAccountModal(true);
    accountForm.setFieldsValue(obj);
  };

  const onUpdate = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);
      delete finalObj.password;
      if (photo) {
        finalObj.profile = photo;
      }
      const httpReq = http();
      await httpReq.put(`/api/customers/${edit._id}`, finalObj);
      messageApi.success("Customer Update Successfully !");
      setNo(no + 1);
      setEdit(null);
      setPhoto(null);
      setSignature(null);
      setEdit(null);
      setAccountModal(false);
      accountForm.resetFields();
    } catch (error) {
      messageApi.error("Unable to update Customer!");
    } finally {
      setLoading(false);
    }
  };

  // Delete Customer
  const onDeleteCustomer = async (id) => {
    try {
      const httpReq = http();
      await httpReq.delete(`/api/customers/${id}`);
      messageApi.success("Customer Deleted Successfully !");
      setNo(no + 1);
    } catch (error) {
      messageApi.error("Unable to delete Customer!");
    }
  };

  // Search Function
  const onSearch = (e) => {
    let value = e.target.value.trim().toLowerCase();
    let filteredData =
      finalCustomer &&
      finalCustomer.filter((cust) => {
        if (cust?.fullname.toLowerCase().indexOf(value) != -1) {
          return cust;
        } else if (
          cust?.accountNo.toString().toLowerCase().indexOf(value) != -1
        ) {
          return cust;
        } else if (cust?.dob.toLowerCase().indexOf(value) != -1) {
          return cust;
        } else if (cust?.email.toLowerCase().indexOf(value) != -1) {
          return cust;
        } else if (cust?.mobile.toLowerCase().indexOf(value) != -1) {
          return cust;
        } else if (
          cust?.finalBalance.toString().toLowerCase().indexOf(value) != -1
        ) {
          return cust;
        } else if (cust?.createBy.toLowerCase().indexOf(value) != -1) {
          return cust;
        } else if (cust?.fatherName.toLowerCase().indexOf(value) != -1) {
          return cust;
        }
      });
    setAllCustomer(filteredData);
  };

  // Columns for Table
  const columns = [
    // Photo
    {
      title: "Photo",
      key: "photo",
      render: (src, obj) => (
        <Image
          src={`${import.meta.env.VITE_BASEURL}/${obj?.profile}`}
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
          src={`${import.meta.env.VITE_BASEURL}/${obj?.signature}`}
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
        <Button
          type="text"
          shape="circle"
          className="!bg-blue-100 !text-blue-500"
          icon={<DownloadOutlined />}
        />
      ),
    },
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
    // Balance
    {
      title: "Balance",
      dataIndex: "finalBalance",
      key: "finalBalance",
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
    // Create By
    {
      title: "Create By",
      dataIndex: "createBy",
      key: "createBy",
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
            onConfirm={() => onEditCustomer(obj)}
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
            onConfirm={() => onDeleteCustomer(obj._id)}
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

  return (
    <Empployeelayout>
      {context}
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
            dataSource={allCustomer}
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
        <Form
          layout="vertical"
          onFinish={edit ? onUpdate : onFinish}
          form={accountForm}
        >
          <div className="grid md:grid-cols-3 gap-x-3">
            {/* Account No Input */}
            <Item
              label="Account No"
              name="accountNo"
              rules={[{ required: true, message: "Account No is required!" }]}
            >
              <Input disabled placeholder="Account No" />
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
              rules={[
                {
                  required: edit ? false : true,
                  message: "Email is required!",
                },
              ]}
            >
              <Input disabled={edit ? true : false} placeholder="Email" />
            </Item>
            {/* Password Input */}
            <Item
              label="Password"
              name="password"
              rules={[
                {
                  required: edit ? false : true,
                  message: "Password is required!",
                },
              ]}
            >
              <Input disabled={edit ? true : false} placeholder="Password" />
            </Item>
            {/* Father Name Input */}
            <Item
              label="DOB"
              name="dob"
              rules={[{ required: true, message: "DOB is required!" }]}
            >
              <Input type="date" />
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
            {/* Profile Input */}
            <Item
              label="Profile"
              name="pic"
              // rules={[{ required: true, message: "Photo is required!" }]}
            >
              <Input type="file" onChange={handlePhoto} />
            </Item>
            {/* Signature Input */}
            <Item
              label="Signature"
              name="sign"
              // rules={[{ required: true, message: "Signature is required!" }]}
            >
              <Input type="file" onChange={handleSignature} />
            </Item>
            {/* Document Input */}
            <Item
              label="Document"
              name="doc"
              // rules={[{ required: true, message: "Document is required!" }]}
            >
              <Input type="file" onChange={handleDocument} />
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
              loading={loading}
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
