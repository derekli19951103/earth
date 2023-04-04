import { client } from "@/graphql/client";
import {
  GetSessionDocument,
  LoginDocument,
  LogoutDocument,
  RegisterDocument,
} from "@/graphql/gql/graphql";
import { UserOutlined, CaretLeftOutlined } from "@ant-design/icons";
import {
  Space,
  Avatar,
  Drawer,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context";

export const MainMenu = () => {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useContext(AppContext);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

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

  const handleLogout = () => {
    client.request(LogoutDocument).then(() => {
      localStorage.removeItem("session");
      setUser({
        id: undefined,
        username: undefined,
        email: undefined,
      });
    });
  };

  const handleLogin = (values: { email: string; password: string }) => {
    client
      .request(LoginDocument, { input: values })
      .then((data) => {
        const user = data.login;
        setUser({
          id: user.userId,
          username: user.username,
          email: user.email,
        });
        localStorage.setItem("session", user.token);
        setLoginOpen(false);
      })
      .catch((e) => message.error(e.response.errors[0].message));
  };

  const handleRegister = (values: {
    email: string;
    password: string;
    username: string;
  }) => {
    const { email, password, username } = values;
    client
      .request(RegisterDocument, { input: { email, password, username } })
      .then(() => {
        setRegisterOpen(false);
      })
      .catch((e) => message.error(e.response.errors[0].message));
  };

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
        <Card
          title={user.username || "User Login"}
          extra={
            <Button
              onClick={
                user.id
                  ? handleLogout
                  : () => {
                      setLoginOpen(true);
                    }
              }
            >
              {user.id ? "Log out" : "Login"}
            </Button>
          }
        >
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="Locations" value={112893} />
            </Col>
            <Col span={12}>
              <Statistic title="Photos" value={112893} />
            </Col>
          </Row>
        </Card>
      </Drawer>

      <Modal
        title="Login"
        open={loginOpen}
        onCancel={() => setLoginOpen(false)}
        footer={null}
      >
        {registerOpen ? (
          <Form onFinish={handleRegister} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              required={false}
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              label="Username"
              name="username"
              required={false}
              rules={[
                { required: true, message: "Please enter your username" },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              required={false}
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirm_password"
              required={false}
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please enter your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                block
                onClick={() => {
                  setRegisterOpen(false);
                }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form onFinish={handleLogin} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              required={false}
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              required={false}
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                block
                onClick={() => {
                  setRegisterOpen(true);
                }}
              >
                Register
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};
