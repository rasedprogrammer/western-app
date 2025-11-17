import {
  Button,
  Card,
  Form,
  Input,
  Image,
  message,
  Table,
  Popconfirm,
} from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { trimData, http } from "../../../modules/modules";
import swal from "sweetalert";
import { useEffect, useState } from "react";

const { Item } = Form;
const NewEmployee = () => {
  // States Collection
  const [empForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [allEmployee, setAllEmployee] = useState([]);
  const [no, setNo] = useState(0);

  // Fetch All Employee
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/users");
        console.log(data);

        setAllEmployee(data.data);
      } catch (error) {
        messageApi.error("Unable To Fetch Employee Data");
      }
    };
    fetcher();
  }, [no]);

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
      // fixed: "right",
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
          <Button
            type="text"
            className="!text-green-500 !bg-green-100"
            icon={<EditOutlined />}
          />
          <Popconfirm
            title = "Are you sure ?"
            description = "Once you delete, you can not re-store it!"
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
      const httpReq = http();
      const { data } = await httpReq.post(`/api/users`, finalObj);
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

  // Delete User
  const onDeleteUser = async (id) => {
    try {
      const httpReq = http();
      await httpReq.delete(`/api/users/${id}`);
      messageApi.success("Employee Deleted Successfully !");
      setNo(no + 1);
    } catch (error) {
      messageApi.error("Unable to delete user!")
    }
  }

  // Handle Upload
  const handleUpload = async (e) => {
    try {
      let file = e.target.files[0];
      const formData = new FormData();
      formData.append("photo", file);
      const httpReq = http();
      const { data } = await httpReq.post("/api/upload", formData);
      setPhoto(data.filePath);
    } catch (error) {
      swal("Failed", "Unable to Upload File", "warning");
    }
  };

  return (
    <Adminlayout>
      {context}
      <div className="grid md:grid-cols-3 gap-3">
        <Card title="Add New Employee">
          <Form form={empForm} onFinish={onFinish} layout="vertical">
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
              <Input />
            </Item>
            <Item name="password" label="Password" rules={[{ required: true }]}>
              <Input />
            </Item>
            {/* Employee Address Section */}
            <Item label="Emplyee Address" name="address">
              <Input.TextArea />
            </Item>
            <Item>
              <Button
                loading={loading}
                type="text"
                htmlType="submit"
                className="!bg-blue-500 !font-bold !text-white w-full"
              >
                Submit
              </Button>
            </Item>
          </Form>
        </Card>
        <Card
          title="Employee List"
          className="md:col-span-2"
          style={{ overflowX: "auto" }}
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
