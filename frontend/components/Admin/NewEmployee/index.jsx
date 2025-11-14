import { Button, Card, Form, Input, Table } from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { trimData } from "../../../modules/modules";
import axios from "axios";
import swal from "sweetalert";
import { useState } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BASEURL;

const { Item } = Form;
const NewEmployee = () => {
  // States Collection
  const [empForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // Columns for Table
  const columns = [
    {
      title: "Profile",
      key: "profile",
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
      render: () => (
        <div className="flex gap-1">
          <Button
            type="text"
            className="!text-pink-500 !bg-pink-100"
            icon={<EyeInvisibleOutlined />}
          />
          <Button
            type="text"
            className="!text-green-500 !bg-green-100"
            icon={<EditOutlined />}
          />
          <Button
            type="text"
            className="!text-rose-500 !bg-rose-100"
            icon={<DeleteOutlined />}
          />
        </div>
      ),
    },
  ];
  // Create Employee
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      const { data } = await axios.post(`/api/users`, finalObj);
      swal("Success", "Employee Created Successfully!", "success");
      empForm.resetFields();
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

  return (
    <Adminlayout>
      <div className="grid md:grid-cols-3 gap-3">
        <Card title="Add New Employee">
          <Form form={empForm} onFinish={onFinish} layout="vertical">
            <Item label="Profile" name="xyz">
              <Input type="file" />
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
        <Card title="Employee List" className="md:col-span-2">
          <Table columns={columns} dataSource={[{}, {}]} />
        </Card>
      </div>
    </Adminlayout>
  );
};

export default NewEmployee;
