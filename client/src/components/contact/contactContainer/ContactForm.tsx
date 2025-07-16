"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Input, message, Button, Flex } from "antd";
import { contactSubmitFormApi } from "@/services/contact";
import { ContactFormValues } from "@/types/contactFormtypes";

const { TextArea } = Input;

const initialFormValues: ContactFormValues = {
  firstName: "",
  subject: "",
  email: "",
  phone: "",
  message: "",
};

const ContactForm = () => {
  const [formValues, setFormValues] =
    useState<ContactFormValues>(initialFormValues);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return Object.values(formValues).every((val) => val.trim() !== "");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid()) {
      message.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", formValues.firstName);
    formData.append("subject", formValues.subject);
    formData.append("email", formValues.email);
    formData.append("phone", formValues.phone);
    formData.append("message", formValues.message);

    try {
      const result = await contactSubmitFormApi(formData);
      if (result.status == "success") {
        messageApi.success(result?.message || "Message sent successfully!");
        setFormValues(initialFormValues);
      } else {
        messageApi.error("Something went wrong!");
      }
    } catch (error) {
      message.error("Network error!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {contextHolder}
      <Flex vertical gap={20}>
        <div className='grid grid-cols-2 gap-4 mb-5 bg-[#FFFFFF] py-10 px-4 md:px-8"'>
          <Input
            name="firstName"
            placeholder="Name"
            value={formValues.firstName}
            onChange={handleChange}
            required
            style={{
              paddingTop: "12px",
              paddingBottom: "12px",
              fontSize: "16px",
            }}
          />
          <Input
            name="subject"
            placeholder="Subject"
            value={formValues.subject}
            onChange={handleChange}
            required
            style={{
              paddingTop: "12px",
              paddingBottom: "12px",
              fontSize: "16px",
            }}
          />
          <Input
            name="email"
            placeholder="Email"
            value={formValues.email}
            onChange={handleChange}
            required
            style={{
              paddingTop: "12px",
              paddingBottom: "12px",
              fontSize: "16px",
            }}
          />
          <Input
            name="phone"
            placeholder="Phone Number"
            value={formValues.phone}
            onChange={handleChange}
            required
            style={{
              paddingTop: "12px",
              paddingBottom: "12px",
              fontSize: "16px",
            }}
          />
          <div className="col-span-2">
            <TextArea
              name="message"
              maxLength={100}
              placeholder="Your Message"
              value={formValues.message}
              onChange={handleChange}
              rows={2}
              required
              style={{
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "1px solid #d9d9d9",
                borderRadius: "0",
                boxShadow: "none",
                fontSize: "16px",
              }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
            style={{
              backgroundColor: "#F66C0E",
              color: "white",
              padding: "14px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </Flex>
    </form>
  );
};

export default ContactForm;
