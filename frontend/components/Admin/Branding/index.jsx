import { Button, Card, Form, Input } from "antd";
import { EditFilled } from "@ant-design/icons";
import Adminlayout from "../../Layout/Adminlayout";

const { Item } = Form;

const Branding = () => {
  const [bankFrom] = Form.useForm();

  // Store Bank Details
  const onFinish = (values) => {
    console.log(values);
  };
  return (
    <Adminlayout>
      <Card
        title="Western Travels Details"
        extra={<Button icon={<EditFilled />}></Button>}
      >
        <Form form={bankFrom} layout="vertical" onFinish={onFinish}>
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
              name="bankTagName"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            {/*  */}
            <Item label="Bank Logo" name="xyz">
              <Input type="file" />
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
            {/*  */}
            <Item
              label="Admin Full Name"
              name="fullname"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            {/*  */}
            <Item label="Admin Email" name="email" rules={[{ required: true }]}>
              <Input />
            </Item>
            {/*  */}
            <Item
              label="Admin Password"
              name="password"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Item>
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
          <Item className="flex justify-end items-center">
            <Button
              type="text"
              htmlType="submit"
              className="!bg-blue-500 !text-white !font-bold"
            >
              Submit
            </Button>
          </Item>
        </Form>
      </Card>
    </Adminlayout>
  );
};

export default Branding;
