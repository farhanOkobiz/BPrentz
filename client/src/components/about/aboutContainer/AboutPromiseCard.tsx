import Image from "next/image";

const AboutPromiseCard = () => {
  return (
    <div className="flex flex-col items-center text-center p-6  rounded-2xl shadow-md hover:shadow-lg transition">
      <Image
        height={500}
        width={500}
        src="/images/check-mark.png"
        alt="img"
        className="w-16 h-16 mb-4"
      />
      <h4 className="text-lg font-[900] mb-2">Price Promise</h4>
      <p className="text-sm text-justify text-gray-500">
        Find the perfect place at a great price as we commit to offering
        competitive rates on our platform
      </p>
    </div>
  );
};
export default AboutPromiseCard;
