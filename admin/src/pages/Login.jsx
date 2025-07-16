import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo.png";
import AuthServices from "../services/auth.services";
import { useMutation } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
const { processLogin } = AuthServices;
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isPending, mutate } = useMutation({
    mutationFn: processLogin,
    onSuccess: ({ accessToken }) => {
      login({ accessToken });
      message.success("Login successful!");
      navigate("/");
    },
    onError: (error) => {
      message.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    },
  });
  const onFinish = async (values) => {
    const { email, password } = values;
    mutate({ email, password });
  };
  return (
    <div className="flex justify-center flex-col items-center lg:h-screen bg-gradient-to-r from-indigo-200 to-yellow-100 ">
      <div className="container w-full flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-[130px] md:w-[200px] ">
          <img src={logo} alt="Logo" className="rounded-full" />
        </div>
        <div className="md:w-[500px] h-full  p-10 rounded-md bg-white shadow-lg">
          <h1 className="text-3xl my-2 mb-8 font-bold text-center !text-[#F15927]">
            Homzystay
          </h1>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                className="py-2 px-4 rounded border border-gray-300 focus:border-indigo-500 focus:shadow-outline"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                className="py-2 px-4 rounded border border-gray-300 focus:border-indigo-500 focus:shadow-outline"
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                className="w-full custom-button text-white font-semibold py-2 rounded transition-all duration-300 shadow-md"
                style={{
                  background:
                    "linear-gradient(90deg, #F15927 0%, #F59E42 100%)",
                  border: "none",
                }}
              >
                {isPending ? "Processing..." : "Log in"}
              </Button>
            </Form.Item>
          </Form>
          <div className="flex justify-between items-center mt-4">
            <span>
              <Link
                to="/forgot-password"
                className="text-slate-700 hover:text-blue-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </span>
          </div>
        </div>
      </div>

      <h1>
        Developed by{" "}
        <Link
          className="font-bold text-black mt-10"
          target="_blank"
          to={"https://okobiz.com"}
        >
          okobiz
        </Link>
      </h1>
    </div>
  );
};

export default Login;
