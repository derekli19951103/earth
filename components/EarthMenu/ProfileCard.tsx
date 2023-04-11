import { client, handleGQLError } from "@/graphql/client";
import {
  GetGeoObjectsDocument,
  LoginDocument,
  LogoutDocument,
  RegisterDocument,
} from "@/graphql/gql/graphql";
import { Button, Card, Col, Form, Input, Modal, Row, Statistic } from "antd";
import { useContext, useState } from "react";
import useSWR from "swr";
import { AppContext } from "../Context";

export const ProfileCard = () => {
  const { user, setUser } = useContext(AppContext);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const geoObjects = useSWR([user.id, "geo"], ([userId]) => {
    if (userId) {
      return client
        .request(GetGeoObjectsDocument, { userId })
        .catch(handleGQLError);
    }
  });

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
      .catch(handleGQLError);
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
      .catch(handleGQLError);
  };

  const handleLogout = () => {
    client
      .request(LogoutDocument)
      .then(() => {
        localStorage.removeItem("session");
        setUser({
          id: undefined,
          username: undefined,
          email: undefined,
        });
      })
      .catch(handleGQLError);
  };

  return (
    <>
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
            <Statistic
              title="Locations"
              value={geoObjects.data?.geoObjects?.length}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Photos"
              value={geoObjects.data?.geoObjects?.length}
            />
          </Col>
        </Row>
      </Card>

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
