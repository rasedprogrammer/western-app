import { Button, Card } from "antd";
import { EditFilled } from "@ant-design/icons";
import Adminlayout from "../../Layout/Adminlayout";

const Branding = () => {
  return (
    <Adminlayout>
      <Card
        title="Western Travels"
        extra={<Button icon={<EditFilled />}></Button>}
      />
    </Adminlayout>
  );
};

export default Branding;
