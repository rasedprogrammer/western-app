import { UserAddOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import { trimData, http } from "../../../modules/modules";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const { Item } = Form;

const Login = () => {
  const cookies = new Cookies();
  const expires = new Date();
  expires.setDate(expires.getDate() + 3);

  const navigate = useNavigate();
  const [messageApi, context] = message.useMessage();

  const onFinish = async (valuses) => {
    try {
      const finalObj = trimData(valuses);
      const httpReq = http();
      const { data } = await httpReq.post(`/api/login`, finalObj);
      if (data?.isLoged && data?.userType === "admin") {
        const { token } = data;
        cookies.set("authToken", token, {
          path: "/",
          expires: expires,
        });
        navigate("/admin");
      } else if (data?.isLoged && data?.userType === "employee") {
        const { token } = data;
        cookies.set("authToken", token, {
          path: "/",
          expires: expires,
        });
        navigate("/employee");
      } else if (data?.isLoged && data?.userType === "customer") {
        const { token } = data;
        cookies.set("authToken", token, {
          path: "/",
          expires: expires,
        });
        navigate("/customer");
      } else {
        messageApi.error("You are not authorized to access this portal.");
      }
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
        <Card className="w-full max-w-lg shadow-xl">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            The Western Tours And Travels Login
          </h1>
          <Form name="login" onFinish={onFinish} layout="vertical">
            <Item name="email" label="Email" rules={[{ required: true }]}>
              <Input
                prefix={<UserAddOutlined />}
                placeholder="Enter Your Username!"
              ></Input>
            </Item>
            <Item name="password" label="Password" rules={[{ required: true }]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter Your Password!"
              ></Input.Password>
            </Item>
            <Item name="submit">
              <Button
                type="text"
                htmlType="submit"
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
