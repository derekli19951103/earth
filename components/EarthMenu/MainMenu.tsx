import { UserOutlined, CaretLeftOutlined } from "@ant-design/icons";
import { Space, Avatar, Drawer } from "antd";
import { useState } from "react";

export const MainMenu = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          borderRadius: 16,
          backgroundColor: "gray",
        }}
        onClick={() => setOpen(true)}
      >
        <Space>
          <Avatar size={32} icon={<UserOutlined />} />{" "}
          <span style={{ color: "white" }}>John Doe</span>
          <CaretLeftOutlined style={{ color: "white" }} />
        </Space>
      </div>

      <Drawer
        title="Basic Drawer"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        closable={false}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
};
