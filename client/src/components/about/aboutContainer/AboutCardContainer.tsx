import AboutBookingCard from "./AboutBookingCard";
import AboutProfessionalCard from "./AboutProfessionalCard";
import AboutPromiseCard from "./AboutPromiseCard";

const AboutCardContainer = () => {
  return (
    <section className="Container">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4 md:p-6 bg-white">
        <AboutPromiseCard />
        <AboutBookingCard />
        <AboutProfessionalCard />
      </div>
    </section>
  );
};
export default AboutCardContainer;
