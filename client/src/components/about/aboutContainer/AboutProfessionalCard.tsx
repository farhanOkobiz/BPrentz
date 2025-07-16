import Image from "next/image";

const AboutProfessionalCard = () => {
  return (
    <div className="flex flex-col items-center text-center p-6  rounded-2xl shadow-md hover:shadow-lg transition">
      <Image
        height={500}
        width={500}
        src="/images/woman.png"
        alt="img"
        className="w-16 h-16 mb-4"
      />
      <h4 className="text-lg font-bolder mb-2">Professional Care</h4>
      <p className="text-sm text-justify text-gray-500">
        Our friendly booking experts are happy to answer any questions you have
      </p>
    </div>
  );
};
export default AboutProfessionalCard;
