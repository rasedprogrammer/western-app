import { Button, Card, Form, Input, message } from "antd";
import { EditFilled } from "@ant-design/icons";
import Adminlayout from "../../Layout/Adminlayout";
import { http, trimData } from "../../../modules/modules";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const { Item } = Form;

const Branding = () => {
  const token = cookies.get("authToken");
  const [bankFrom] = Form.useForm();
  const [messageApi, context] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [brandings, setBrandings] = useState(null);
  const [no, setNo] = useState(0);
  const [edit, setEdit] = useState(false);

  // Fetch Branding Store Data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http(token);
        const { data } = await httpReq.get("/api/branding");
        console.log(data);
        bankFrom.setFieldsValue(data?.data[0]);
        setBrandings(data?.data[0]);
        setEdit(true);
      } catch (error) {
        messageApi.error("Unable To Fetch Employee Data");
      }
    };
    fetcher();
  }, [no]);

  // Store Bank Details
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      finalObj.bankLogo = photo ? photo : "bankImages/dummy.png";

      // User Info Object
      let userInfo = {
        email: finalObj.email,
        fullname: finalObj.fullname,
        password: finalObj.password,
        userType: "admin",
        isActive: true,
        profile: "bankImages/dummy.png",
      };

      // Api Call Section Start
      const httpReq = http(token);
      await httpReq.post(`/api/branding`, finalObj);
      await httpReq.post(`/api/users`, userInfo);
      // Api Call Section End
      messageApi.success("Branding Details Stored Successfully !");
      bankFrom.resetFields();
      setPhoto(null);
      setNo(no + 1);
    } catch (error) {
      messageApi.error("Unable to stroe branding details !");
    } finally {
      setLoading(false);
    }
  };
  // Update Bank Details
  const onUpdate = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      if (photo) {
        finalObj.bankLogo = photo;
      }
      const httpReq = http(token);
      await httpReq.put(`/api/branding/${brandings._id}`, finalObj);
      // Api Call Section End
      messageApi.success("Branding Details Updated Successfully !");
      bankFrom.resetFields();
      setPhoto(null);
      setNo(no + 1);
    } catch (error) {
      messageApi.error("Unable to Update branding details !");
    } finally {
      setLoading(false);
    }
  };

  // Handle Upload
  const handleUpload = async (e) => {
    try {
      let file = e.target.files[0];
      const formData = new FormData();
      formData.append("photo", file);
      const httpReq = http(token);
      const { data } = await httpReq.post("/api/upload", formData);
      setPhoto(data.filePath);
    } catch (error) {
      swal("Failed", "Unable to Upload File", "warning");
    }
  };

  return (
    <Adminlayout>
      {context}
      <Card
        title="Western Travels Details"
        extra={
          <Button onClick={() => setEdit(!edit)} icon={<EditFilled />}></Button>
        }
      >
        <Form
          form={bankFrom}
          disabled={edit}
          layout="vertical"
          onFinish={brandings ? onUpdate : onFinish}
        >
          <div className="grid md:grid-cols-3 gap-x-3">
            {/* Bank Name Input */}
            <Item
              label="Bank Name"
              name="bankName"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            {/* Bank Tag Name */}
            <Item
              label="Bank Tag Name"
              name="bankTagLine"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            {/*  */}
            <Item label="Bank Logo" name="xyz">
              <Input type="file" onChange={handleUpload} />
            </Item>
            {/*  */}
            <Item
              label="Bank Account No"
              name="bankAccountNo"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            {/*  */}
            <Item
              label="Bank Account Transaction Id"
              name="bankTransactionId"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            {/*  */}
            <Item
              label="Bank Address"
              name="bankAddress"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            {/* Admin User Details */}
            <div
              className={`${
                brandings
                  ? "hidden"
                  : "md:cols-span-3 grid md:grid-cols-3 gap-x-3"
              }`}
            >
              {/*  */}
              <Item
                label="Admin Full Name"
                name="fullname"
                rules={[{ required: brandings ? false : true }]}
              >
                <Input />
              </Item>
              {/*  */}
              <Item
                label="Admin Email"
                name="email"
                rules={[{ required: brandings ? false : true }]}
              >
                <Input />
              </Item>
              {/*  */}
              <Item
                label="Admin Password"
                name="password"
                rules={[{ required: brandings ? false : true }]}
              >
                <Input.Password />
              </Item>
            </div>
            {/*  */}
            <Item label="Bank Linkedin" name="bankLinkedin">
              <Input type="url" />
            </Item>
            {/*  */}
            <Item label="Bank Twitter" name="bankTwitter">
              <Input type="url" />
            </Item>
            {/*  */}
            <Item label="Bank Facebook" name="bankFacebook">
              <Input type="url" />
            </Item>
          </div>
          <Item label="Bank Description" name="bankDesc">
            <Input.TextArea />
          </Item>
          {bankFrom ? (
            <Item className="flex justify-end items-center">
              <Button
                loading={loading}
                type="text"
                htmlType="submit"
                className="!bg-rose-500 !text-white !font-bold"
              >
                Update
              </Button>
            </Item>
          ) : (
            <Item className="flex justify-end items-center">
              <Button
                loading={loading}
                type="text"
                htmlType="submit"
                className="!bg-blue-500 !text-white !font-bold"
              >
                Submit
              </Button>
            </Item>
          )}
        </Form>
      </Card>
    </Adminlayout>
  );
};

export default Branding;
