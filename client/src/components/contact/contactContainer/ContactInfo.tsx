import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const ContactInfo = () => {
  return (
    <div className="bg-[#F3F2F1] py-10 px-4 md:px-8">
      <div className="max-w-2xl mx-auto text-start mb-10">
        <h1 className="text-3xl font-semibold text-black mb-2">
          Contact Information
        </h1>
        <p className="text-gray-600 text-[18px] tracking-wider">
          Say something to start a live chat!
        </p>
      </div>

      <div className="w-full mx-auto flex flex-col gap-6">
        {/* Phone 1 */}
        <div className="flex items-start gap-4">
          <PhoneOutlined className="text-2xl text-primary mt-1" />
          <div>
            <a
              href="tel:01786330011"
              className="text-gray-700 font-medium hover:underline"
            >
              01786330011
            </a>
          </div>
        </div>

        {/* Phone 2 */}
        <div className="flex items-start gap-4">
          <PhoneOutlined className="text-2xl text-primary mt-1" />
          <div>
            <a
              href="tel:01786330022"
              className="text-gray-700 font-medium hover:underline"
            >
              01786330022
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4">
          <MailOutlined className="text-2xl text-primary mt-1" />
          <div>
            <a
              href="mailto:info@fatihatravels1.com"
              className="text-gray-700 font-medium hover:underline"
            >
              info@fatihatravels1.com
            </a>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-4">
          <EnvironmentOutlined className="text-2xl text-primary mt-1" />
          <div>
            <a
              href="https://www.google.com/maps/place/Ground+Floor,+Hazi+Ashraf+Shopping+Complex,+Hemayetpur,+Savar,+Dhaka,+Bangladesh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 font-medium hover:underline"
            >
              Ground Floor, Hazi Ashraf Shopping Complex, Hemayetpur, Savar,
              Dhaka, Bangladesh
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
