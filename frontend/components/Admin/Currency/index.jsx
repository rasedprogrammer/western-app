import { Button, Card, Form, Input, message, Table, Popconfirm } from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { trimData, http } from "../../../modules/modules";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const { Item } = Form;
const Currency = () => {
  const token = cookies.get("authToken");
  // States Collection
  const [currencyForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [allCurrency, setAllCurrency] = useState([]);
  const [edit, setEdit] = useState(null);
  const [no, setNo] = useState(0);

  // Fetch All Currency
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http(token);
        const { data } = await httpReq.get("/api/currency");
        console.log(data);

        setAllCurrency(data.data);
      } catch (error) {
        messageApi.error("Unable To Fetch Currency Data");
      }
    };
    fetcher();
  }, [no]);

  // Columns for Table
  const columns = [
    {
      title: "Currency Name",
      dataIndex: "currencyName",
      key: "currencyName",
    },
    {
      title: "Currency Description",
      dataIndex: "currencyDesc",
      key: "currencyDesc",
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
            onConfirm={() => onEditCurrency(obj)}
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
            onConfirm={() => onDeleteCurrency(obj._id)}
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
  // Create Currency
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      console.log(finalObj);

      finalObj.key = finalObj.currencyName;
      const httpReq = http(token);
      const { data } = await httpReq.post(`/api/currency`, finalObj);

      messageApi.success("Currency Created Successfully !");
      currencyForm.resetFields();
      setNo(no + 1);
    } catch (error) {
      if (error?.response?.data?.error?.code === 11000) {
        currencyForm.setFields([
          {
            name: "currencyName",
            errors: ["Currency Already Exists!"],
          },
        ]);
      } else {
        messageApi.error("Unable to create Currency!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update Currency
  const onEditCurrency = async (obj) => {
    setEdit(obj);
    currencyForm.setFieldsValue(obj);
  };

  const onUpdate = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);
      const httpReq = http(token);
      await httpReq.put(`/api/currency/${edit._id}`, finalObj);
      messageApi.success("Currency Update Successfully !");
      setNo(no + 1);
      setEdit(null);
      currencyForm.resetFields();
    } catch (error) {
      messageApi.error("Unable to update Currency!");
    } finally {
      setLoading(false);
    }
  };

  // Delete Currency
  const onDeleteCurrency = async (id) => {
    try {
      const httpReq = http(token);
      await httpReq.delete(`/api/currency/${id}`);
      messageApi.success("Currency Deleted Successfully !");
      setNo(no + 1);
    } catch (error) {
      messageApi.error("Unable to delete Currency!");
    }
  };

  return (
    <Adminlayout>
      {context}
      <div className="grid md:grid-cols-3 gap-3">
        <Card title="Add New Currency">
          <Form
            form={currencyForm}
            onFinish={edit ? onUpdate : onFinish}
            layout="vertical"
          >
            <Item
              name="currencyName"
              label="Currency Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            {/* Currency Address Section */}
            <Item label="Currency Description" name="currencyDesc">
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
          title="Currency List"
          className="md:col-span-2"
          style={{ overflowX: "auto" }}
        >
          <Table
            columns={columns}
            dataSource={allCurrency}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </div>
    </Adminlayout>
  );
};

export default Currency;
