"use client";

import { Input, Modal, Button, message } from "antd";
import { useState } from "react";
import SignupModal from "./SignUpModal";
import { AuthServices } from "@/services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { DecodedJwtPayload, LoginResponse } from "@/types/authTypes";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const initialForm = {
  email: "",
  password: "",
};

const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [messageApi, contextHolder] = message.useMessage();
  const { login } = useAuth();

  const { mutate: loginUser, isPending } = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: AuthServices.processLogin,
    onSuccess: (data) => {
      const accessToken = data?.accessToken;

      if (!accessToken) {
        messageApi.error("No access token received.");
        return;
      }

      try {
        const decoded = jwtDecode<DecodedJwtPayload>(accessToken);
        const role = decoded.role;

        login({ accessToken });

        messageApi.success(data.message || "Login successful!");
        onClose();
        setFormData(initialForm);

        // Client-side redirect
        router.push(role === "host" ? "/host-dashboard" : "/");
      } catch (error) {
        console.error("Invalid token", error);
        messageApi.error("Invalid token.");
      }
    },

    onError: (error) => {
      messageApi.error(error.message || "Login failed. Please try again.");
    },
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { email, password } = formData;
    if (!email || !password) {
      return messageApi.warning("Please fill in both fields.");
    }

    loginUser({ email, password });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <div className="pb-4 border-b border-gray-200 text-center text-lg font-semibold">
            Welcome to HomZay Stay
          </div>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        centered
      >
        <div className="space-y-4">
          <div className="py-3">
            <Input
              name="email"
              placeholder=" Your email address "
              value={formData.email}
              onChange={handleChange}
              size="large"
            />
          </div>
          <div className="py-3">
            <Input.Password
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              size="large"
            />
          </div>
          <Button
            block
            size="large"
            type="primary"
            className="!bg-primary mt-4"
            onClick={handleSubmit}
            loading={isPending}
          >
            Continue
          </Button>
          <Button
            type="link"
            onClick={() => {
              router.push("/forgot-password");
              onClose();
            }}
          >
            Forgot Password?
          </Button>
          <div className="text-center">
            <h3>
              Don’t have an account?{" "}
              <Button
                type="link"
                onClick={() => {
                  onClose();
                  setTimeout(() => setShowModal(true), 300);
                }}
              >
                SignUp
              </Button>
            </h3>
          </div>
        </div>
      </Modal>

      <SignupModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default LoginModal;
