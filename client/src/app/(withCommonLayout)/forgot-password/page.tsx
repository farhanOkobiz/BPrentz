"use client";

import { AuthServices } from "@/services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate, isPending } = useMutation({
    mutationFn: AuthServices.processForgotPassword,
    onSuccess: async () => {
      messageApi.success("OTP sent to your email");
      const email = form.getFieldValue("email");
      await router.push(`/reset-password?email=${email}`);
    },
    onError: () => {
      messageApi.error("Failed to send OTP. Try again.");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
        {contextHolder}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>
        <Form
          form={form}
          onFinish={mutate}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label={<span className="text-sm text-gray-700">Email</span>}
            rules={[
              { required: true, message: "Please enter your email." },
              { type: "email", message: "Enter a valid email." },
            ]}
          >
            <Input
              placeholder="Enter your email address"
              maxLength={50}
              className="py-2 px-3 rounded-md "
            />
          </Form.Item>

          <Form.Item className="mt-6 mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              block
              className="!bg-primary !rounded-md !h-10"
            >
              Send OTP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
