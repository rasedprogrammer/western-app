import { UserAddOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import { trimData, http } from "../../../modules/modules";
const { Item } = Form;

const Login = () => {
  const [messageApi, context] = message.useMessage();

  const onFinish = async (valuses) => {
    try {
      const finalObj = trimData(valuses);
      const httpReq = http();
      const { data } = await httpReq.post(`/api/login`, finalObj);
      console.log(data);
      messageApi.success("Login Successful");
    } catch (error) {
      messageApi.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex">
      {context}
      {/* Image Section */}
      <div className="w-1/2 hidden md:flex justify-center items-center">
        <img
          src="/bank-img.jpg"
          alt="Bank Icon"
          className="w-4/5 object-contain"
        />
      </div>
      {/* Login Form Section */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6 bg-white">
        <Card className="w-full max-w-sm shadow-xl">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Bank Login
          </h1>
          <Form name="login" onFinish={onFinish} layout="vertical">
            <Item name="email" label="Email" rules={[{ required: true }]}>
              <Input
                prefix={<UserAddOutlined />}
                placeholder="Enter Your Username!"
              ></Input>
            </Item>
            <Item name="password" label="Password" rules={[{ required: true }]}>
              <Input
                prefix={<LockOutlined />}
                placeholder="Enter Your Password!"
              ></Input>
            </Item>
            <Item name="submit">
              <Button
                htmlType="submit"
                type="text"
                block
                className="!bg-blue-500 !font-bold !text-white"
              >
                Login
              </Button>
            </Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
