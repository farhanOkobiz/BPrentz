import Image from "next/image";

const AboutBookingCard = () => {
  return (
    <div className="flex flex-col items-center text-center p-6  rounded-2xl shadow-md hover:shadow-lg transition">
      <Image
        height={500}
        width={500}
        src="/images/license.png"
        alt="img"
        className="w-16 h-16 mb-4"
      />
      <h4 className="text-lg font-bolder mb-2">Effortless Booking</h4>
      <p className="text-sm text-justify text-gray-500">
        FBook in clicks. Our user-friendly platform lets you reserve your stay
        in minutes
      </p>
    </div>
  );
};
export default AboutBookingCard;
