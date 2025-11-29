import {
  Button,
  Card,
  Form,
  Input,
  Image,
  message,
  Table,
  Popconfirm,
  Select,
} from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  trimData,
  http,
  fetchData,
  uploadFile,
} from "../../../modules/modules";
import swal from "sweetalert";
import useSWR from "swr";
import { useEffect, useState } from "react";

const { Item } = Form;
const NewEmployee = () => {
  // States Collection
  const [empForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [allEmployee, setAllEmployee] = useState([]);
  const [finalEmployee, setFinalEmployee] = useState([]);
  const [allBranch, setAllBranch] = useState([]);
  const [edit, setEdit] = useState(null);
  const [no, setNo] = useState(0);

  // Branch Select Option
  const { data: branches, error: bError } = useSWR("/api/branch", fetchData, {
    refreshInterval: 1200000,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    if (branches) {
      const branchOptions = branches?.data?.map((item) => ({
        label: item.branchName,
        value: item.branchName,
        key: item.key,
      }));
      setAllBranch(branchOptions);
    }
  }, [branches]);

  // Fetch All Employee
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/users");
        console.log(data);

        setAllEmployee(data.data);
        setFinalEmployee(data.data);
      } catch (error) {
        messageApi.error("Unable To Fetch Employee Data");
      }
    };
    fetcher();
  }, [no]);

  // Search Function
  const onSearch = (e) => {
    let value = e.target.value.trim().toLowerCase();
    let filteredData =
      finalEmployee &&
      finalEmployee.filter((emp) => {
        if (emp.fullname.toLowerCase().indexOf(value) != -1) {
          return emp;
        } else if (emp.userType.toLowerCase().indexOf(value) != -1) {
          return emp;
        } else if (emp.branch.toLowerCase().indexOf(value) != -1) {
          return emp;
        } else if (emp.email.toLowerCase().indexOf(value) != -1) {
          return emp;
        } else if (emp.mobile.toLowerCase().indexOf(value) != -1) {
          return emp;
        } else if (emp.address.toLowerCase().indexOf(value) != -1) {
          return emp;
        }
      });
    setAllEmployee(filteredData);
  };

  // Columns for Table
  const columns = [
    {
      title: "Profile",
      key: "profile",
      render: (src, obj) => (
        <Image
          src={`${import.meta.env.VITE_BASEURL}/${obj.profile}`}
          className="rounded-full"
          width={40}
          height={40}
        />
      ),
    },
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
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
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
  // Create Employee
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      finalObj.profile = photo ? photo : "bankImages/dummy.png";
      finalObj.key = finalObj.email;
      finalObj.userType = "employee";
      const httpReq = http();
      await httpReq.post(`/api/users`, finalObj);
      const emailObj = {
        email: finalObj.email,
        password: finalObj.password,
      };
      const res = await httpReq.post(`/api/send-email`, emailObj);
      console.log("Email Send Response", res);

      swal("Success", "Employee Created Successfully!", "success");
      empForm.resetFields();
      setPhoto(null);
      setNo(no + 1);
    } catch (error) {
      if (error?.response?.data?.error?.code === 11000) {
        empForm.setFields([
          {
            name: "email",
            errors: ["Email Already Exists!"],
          },
        ]);
      } else {
        swal("Warning", "Try again later", "warning");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update is Active
  const updateIsActive = async (id, isActive) => {
    try {
      const obj = {
        isActive: !isActive,
      };
      const httpReq = http();
      await httpReq.put(`/api/users/${id}`, obj);

      messageApi.success("Record updated successfully !");
      setNo(no + 1);
    } catch (error) {
      messageApi.error("Unable to update isActive!");
    }
  };

  // Update User
  const onEditUser = async (obj) => {
    setEdit(obj);
    empForm.setFieldsValue(obj);
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
      await httpReq.put(`/api/users/${edit._id}`, finalObj);
      messageApi.success("Employee Update Successfully !");
      setNo(no + 1);
      setEdit(null);
      setPhoto(null);
      empForm.resetFields();
    } catch (error) {
      messageApi.error("Unable to update Employee!");
    } finally {
      setLoading(false);
    }
  };

  // Delete User
  const onDeleteUser = async (id) => {
    try {
      const httpReq = http();
      await httpReq.delete(`/api/users/${id}`);
      messageApi.success("Employee Deleted Successfully !");
      setNo(no + 1);
    } catch (error) {
      messageApi.error("Unable to delete user!");
    }
  };

  // Handle Upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const folderName = "employeePhoto";
    try {
      const result = await uploadFile(file, folderName);
      setPhoto(result.filePath);
    } catch (error) {
      swal("Failed", "Unable to Upload File", "warning");
    }
  };

  return (
    <Adminlayout>
      {context}
      <div className="grid md:grid-cols-3 gap-3">
        <Card title="Add New Employee">
          <Form
            form={empForm}
            onFinish={edit ? onUpdate : onFinish}
            layout="vertical"
          >
            {/* Branch Select Option */}
            <Item
              name="branch"
              label="Select Branch"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select Branch" options={allBranch} />
            </Item>
            {/* Employee Form Start */}
            <Item label="Profile" name="xyz">
              <Input onChange={handleUpload} type="file" />
            </Item>
            <div className="grid md:grid-cols-2 gap-x-2">
              <Item
                name="fullname"
                label="Fullname"
                rules={[{ required: true }]}
              >
                <Input />
              </Item>
              <Item name="mobile" label="Mobile" rules={[{ required: true }]}>
                <Input type="number" />
              </Item>
            </div>
            <Item name="email" label="Email" rules={[{ required: true }]}>
              <Input disabled={edit ? true : false} />
            </Item>
            <Item name="password" label="Password" rules={[{ required: true }]}>
              <Input disabled={edit ? true : false} />
            </Item>
            {/* Employee Address Section */}
            <Item label="Emplyee Address" name="address">
              <Input.TextArea />
            </Item>
            <Item>
              {edit ? (
                <Button
                  loading={loading}
                  type="text"
                  htmlType="submit"
                  className="!bg-rose-500 !font-bold !text-white w-full"
                >
                  Update
                </Button>
              ) : (
                <Button
                  loading={loading}
                  type="text"
                  htmlType="submit"
                  className="!bg-blue-500 !font-bold !text-white w-full"
                >
                  Submit
                </Button>
              )}
            </Item>
          </Form>
        </Card>
        <Card
          title="Employee List"
          className="md:col-span-2"
          style={{ overflowX: "auto" }}
          extra={
            <div>
              <Input
                placeholder="Search by all"
                prefix={<SearchOutlined />}
                onChange={onSearch}
              />
            </div>
          }
        >
          <Table
            columns={columns}
            dataSource={allEmployee}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </div>
    </Adminlayout>
  );
};

export default NewEmployee;
