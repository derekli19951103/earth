import { client } from "@/graphql/client";
import { GetSessionDocument } from "@/graphql/gql/graphql";
import {
  CaretLeftOutlined,
  InboxOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Divider, Drawer, Space, Typography, Upload } from "antd";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context";
import { ProfileCard } from "./ProfileCard";
import { UploadData } from "./UploadData";

export const MainMenu = () => {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useContext(AppContext);

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      client.setHeader("Authorization", session);
      client
        .request(GetSessionDocument)
        .then((data) => {
          const user = data.session;
          setUser({
            id: user.id,
            username: user.username,
            email: user.email,
          });
        })
        .catch(() => {
          localStorage.removeItem("session");
        });
    }
  }, []);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          borderRadius: 16,
          backgroundColor: "gray",
          userSelect: "none",
        }}
        onClick={() => setOpen(true)}
      >
        <Space>
          <Avatar size={32} icon={<UserOutlined />} />{" "}
          <span style={{ color: "white" }}>{user.username || "Login"}</span>
          <CaretLeftOutlined style={{ color: "white", marginRight: 5 }} />
        </Space>
      </div>

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        closable={false}
      >
        <ProfileCard />

        <Divider />

        <UploadData />
      </Drawer>
    </>
  );
};
