import { Button, Card, Form, Input, message, Table, Popconfirm } from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { trimData, http } from "../../../modules/modules";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const { Item } = Form;
const Branch = () => {
  const token = cookies.get("authToken");
  // States Collection
  const [branchForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [allBranch, setAllBranch] = useState([]);
  const [edit, setEdit] = useState(null);
  const [no, setNo] = useState(0);

  // Fetch All Branch
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http(token);
        const { data } = await httpReq.get("/api/branch");
        console.log(data);

        setAllBranch(data.data);
      } catch (error) {
        messageApi.error("Unable To Fetch Branch Data");
      }
    };
    fetcher();
  }, [no]);

  // Columns for Table
  const columns = [
    {
      title: "Branch Name",
      dataIndex: "branchName",
      key: "branchName",
    },
    {
      title: "Branch Address",
      dataIndex: "branchAddress",
      key: "branchAddress",
    },
    {
      title: "Action",
      key: "action",
      // fixed: "right",
      render: (_, obj) => (
        <div className="flex gap-1">
          <Popconfirm
            title="Are you sure !"
            description="Onec you update, you can re-update it!"
            onCancel={() => messageApi.info("No changes occur !")}
            onConfirm={() => onEditBranch(obj)}
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
            onConfirm={() => onDeleteBranch(obj._id)}
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
  // Create Branch
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      console.log(finalObj);

      finalObj.key = finalObj.branchName;
      const httpReq = http(token);
      const { data } = await httpReq.post(`/api/branch`, finalObj);

      messageApi.success("Branch Created Successfully !");
      branchForm.resetFields();
      setNo(no + 1);
    } catch (error) {
      if (error?.response?.data?.error?.code === 11000) {
        branchForm.setFields([
          {
            name: "branchName",
            errors: ["Branch Already Exists!"],
          },
        ]);
      } else {
        messageApi.error("Unable to create Branch!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update Branch
  const onEditBranch = async (obj) => {
    setEdit(obj);
    branchForm.setFieldsValue(obj);
  };

  const onUpdate = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);
      const httpReq = http(token);
      await httpReq.put(`/api/branch/${edit._id}`, finalObj);
      messageApi.success("Branch Update Successfully !");
      setNo(no + 1);
      setEdit(null);
      branchForm.resetFields();
    } catch (error) {
      messageApi.error("Unable to update Branch!");
    } finally {
      setLoading(false);
    }
  };

  // Delete Branch
  const onDeleteBranch = async (id) => {
    try {
      const httpReq = http(token);
      await httpReq.delete(`/api/branch/${id}`);
      messageApi.success("Branch Deleted Successfully !");
      setNo(no + 1);
    } catch (error) {
      messageApi.error("Unable to delete Branch!");
    }
  };

  return (
    <Adminlayout>
      {context}
      <div className="grid md:grid-cols-3 gap-3">
        <Card title="Add New Branch">
          <Form
            form={branchForm}
            onFinish={edit ? onUpdate : onFinish}
            layout="vertical"
          >
            <Item
              name="branchName"
              label="Branch Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            {/* Branch Address Section */}
            <Item label="Branch Address" name="branchAddress">
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
          title="Branch List"
          className="md:col-span-2"
          style={{ overflowX: "auto" }}
        >
          <Table
            columns={columns}
            dataSource={allBranch}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </div>
    </Adminlayout>
  );
};

export default Branch;
